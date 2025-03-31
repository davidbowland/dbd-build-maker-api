import * as events from '@utils/events'
import { channel, channelId, mods, twitchAuthToken, user } from '../__mocks__'
import { getChannelInfo, getChannelMods, getUserFromEvent, validateToken } from '@services/twitch'
import { APIGatewayProxyEventV2 } from '@types'
import { mocked } from 'jest-mock'
import { twitchClientId } from '@config'

const mockApiGetEndpoint = jest.fn()
const mockAuthGetEndpoint = jest.fn()
jest.mock('axios', () => ({
  create: jest.fn().mockImplementation(({ baseURL }) => {
    if (baseURL === 'https://api.twitch.tv') {
      return {
        get: (...args) => mockApiGetEndpoint(...args),
      }
    } else if (baseURL === 'https://id.twitch.tv') {
      return {
        get: (...args) => mockAuthGetEndpoint(...args),
      }
    }
    throw new Error(`Unrecognized baseURL ${baseURL}`)
  }),
}))
jest.mock('axios-retry')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('twitch', () => {
  const validateEndpointUser = {
    expires_in: user.expiresIn,
    login: user.name,
    user_id: user.id,
  }

  beforeAll(() => {
    mockAuthGetEndpoint.mockResolvedValue({ data: validateEndpointUser })
  })

  describe('getChannelMods', () => {
    beforeAll(() => {
      mockApiGetEndpoint.mockResolvedValue({ data: { data: mods, pagination: {} } })
    })

    test('expect mods endpoint to be called', async () => {
      await getChannelMods(channelId, twitchAuthToken)
      expect(mockApiGetEndpoint).toHaveBeenCalledTimes(1)
      expect(mockApiGetEndpoint).toHaveBeenCalledWith('/helix/moderation/moderators', {
        headers: { Authorization: `Bearer ${twitchAuthToken}`, 'Client-ID': twitchClientId },
        params: { broadcaster_id: channelId, first: 100 },
      })
    })

    test('expect mods endpoint returns mods', async () => {
      const result = await getChannelMods(channelId, twitchAuthToken)
      expect(result).toEqual(channel.mods)
    })

    test('expect mods endpoint paginates', async () => {
      const newMods = ['newMod1']
      const pagination = { cursor: '65r4tyuiolkjhbvdertyu' }
      mockApiGetEndpoint.mockResolvedValueOnce({ data: { data: newMods, pagination } })

      const result = await getChannelMods(channelId, twitchAuthToken)
      expect(result).toEqual([...newMods, ...mods])
      expect(mockApiGetEndpoint).toHaveBeenCalledTimes(2)
      expect(mockApiGetEndpoint).toHaveBeenCalledWith('/helix/moderation/moderators', {
        headers: { Authorization: `Bearer ${twitchAuthToken}`, 'Client-ID': twitchClientId },
        params: { after: pagination, broadcaster_id: channelId, first: 100 },
      })
      expect(mockApiGetEndpoint).toHaveBeenCalledWith('/helix/moderation/moderators', {
        headers: { Authorization: `Bearer ${twitchAuthToken}`, 'Client-ID': twitchClientId },
        params: { broadcaster_id: channelId, first: 100 },
      })
    })

    test('expect error when endpoint rejects', async () => {
      mockApiGetEndpoint.mockRejectedValueOnce(new Error('Rejected'))
      await expect(getChannelMods(channelId, twitchAuthToken)).rejects.toBeDefined()
    })
  })

  describe('getChannelInfo', () => {
    const displayName = 'biggerthansheexpected'
    const offlinePicUrl = 'http://dbowland.com/offline.png'
    const profilePicUrl = 'http://dbowland.com/profile.png'

    beforeAll(() => {
      mockApiGetEndpoint.mockResolvedValue({
        data: {
          data: [
            {
              display_name: displayName,
              offline_image_url: offlinePicUrl,
              profile_image_url: profilePicUrl,
            },
          ],
        },
      })
    })

    test('expect info endpoint to be called', async () => {
      await getChannelInfo(channelId, twitchAuthToken)
      expect(mockApiGetEndpoint).toHaveBeenCalledWith('/helix/users', {
        headers: { Authorization: `Bearer ${twitchAuthToken}`, 'Client-ID': twitchClientId },
        params: { id: channelId },
      })
    })

    test('expect info endpoint returns info', async () => {
      const result = await getChannelInfo(channelId, twitchAuthToken)
      expect(result).toEqual({
        name: 'biggerthansheexpected',
        pic: 'http://dbowland.com/profile.png',
      })
    })

    test('expect info endpoint returns info with offline URL if no profile URL', async () => {
      mockApiGetEndpoint.mockResolvedValueOnce({
        data: {
          data: [
            {
              display_name: displayName,
              offline_image_url: offlinePicUrl,
            },
          ],
        },
      })

      const result = await getChannelInfo(channelId, twitchAuthToken)
      expect(result).toEqual({
        name: 'biggerthansheexpected',
        pic: 'http://dbowland.com/offline.png',
      })
    })

    test('expect error when endpoint rejects', async () => {
      mockApiGetEndpoint.mockRejectedValueOnce(new Error('Rejected'))
      await expect(getChannelInfo(channelId, twitchAuthToken)).rejects.toBeDefined()
    })
  })

  describe('validateToken', () => {
    test('expect validate token endpoint to be called', async () => {
      await validateToken(twitchAuthToken)
      expect(mockAuthGetEndpoint).toHaveBeenCalledTimes(1)
      expect(mockAuthGetEndpoint).toHaveBeenCalledWith('/oauth2/validate', {
        headers: { Authorization: `OAuth ${twitchAuthToken}` },
      })
    })

    test('expect user returned from validate endpoint', async () => {
      const validatedUser = await validateToken(twitchAuthToken)
      expect(validatedUser).toEqual(user)
    })

    test('expect undefined returned when invalid token', async () => {
      mockAuthGetEndpoint.mockRejectedValueOnce({ response: { status: 401 } })
      const validatedUser = await validateToken('invalid-token')
      expect(validatedUser).toEqual(undefined)
    })

    test('expect error when endpoint errors', async () => {
      mockAuthGetEndpoint.mockRejectedValueOnce(new Error('Rejected'))

      await expect(validateToken(twitchAuthToken)).rejects.toBeDefined()
    })
  })

  describe('getUserFromEvent', () => {
    const eventExternal = {
      requestContext: {
        domainPrefix: 'dbd-build-maker-api',
      },
    } as unknown as APIGatewayProxyEventV2
    const eventInternal = {
      headers: {
        'x-twitch-id': user.id,
        'x-twitch-name': user.name,
      },
      requestContext: {
        domainPrefix: 'dbd-build-maker-api-internal',
      },
    } as unknown as APIGatewayProxyEventV2

    beforeAll(() => {
      mocked(events).extractTokenFromEvent.mockReturnValue(twitchAuthToken)
    })

    test('expect getUserFromEvent returns validateToken result when external', async () => {
      const result = await getUserFromEvent(eventExternal)
      expect(result).toEqual(user)
      expect(mockAuthGetEndpoint).toHaveBeenCalledTimes(1)
      expect(mockAuthGetEndpoint).toHaveBeenCalledWith('/oauth2/validate', {
        headers: { Authorization: `OAuth ${twitchAuthToken}` },
      })
    })

    test('expect getUserFromEvent returns header values when internal', async () => {
      const result = await getUserFromEvent(eventInternal)
      expect(result).toEqual(expect.objectContaining({ id: user.id, name: user.name }))
      expect(mockAuthGetEndpoint).not.toHaveBeenCalled()
    })
  })
})
