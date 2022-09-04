import * as events from '@utils/events'
import { channel, channelId, mods, twitchAuthToken, user } from '../__mocks__'
import { getChannelInfo, getChannelMods, getUserFromEvent, validateToken } from '@services/twitch'
import { rest, server } from '@setup-server'
import { APIGatewayProxyEventV2 } from '@types'
import { URLSearchParams } from 'url'
import { mocked } from 'jest-mock'
import { twitchClientId } from '@config'

jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('twitch', () => {
  const apiHost = 'https://api.twitch.tv'
  const idHost = 'https://id.twitch.tv'
  const validateEndpointUser = {
    expires_in: user.expiresIn,
    login: user.name,
    user_id: user.id,
  }
  const getValidateEndpoint = jest.fn().mockReturnValue(validateEndpointUser)

  beforeAll(() => {
    server.use(
      rest.get(`${idHost}/oauth2/validate`, async (req, res, ctx) => {
        if (`OAuth ${twitchAuthToken}` !== req.headers.get('Authorization')) {
          return res(ctx.status(401))
        }

        const body = getValidateEndpoint()
        return res(body ? ctx.json(body) : ctx.status(400))
      })
    )
  })

  describe('getChannelMods', () => {
    const getModsEndpoint = jest.fn().mockReturnValue({ data: mods, pagination: {} })

    beforeAll(() => {
      server.use(
        rest.get(`${apiHost}/helix/moderation/moderators`, async (req, res, ctx) => {
          if (
            `Bearer ${twitchAuthToken}` !== req.headers.get('Authorization') ||
            twitchClientId !== req.headers.get('Client-ID')
          ) {
            return res(ctx.status(401))
          }

          const body = getModsEndpoint(req.url.searchParams)
          return res(body ? ctx.json(body) : ctx.status(400))
        })
      )
    })

    test('expect mods endpoint to be called', async () => {
      await getChannelMods(channelId, twitchAuthToken)
      expect(getModsEndpoint).toHaveBeenCalledWith(new URLSearchParams({ broadcaster_id: '123456', first: '100' }))
    })

    test('expect mods endpoint returns mods', async () => {
      const result = await getChannelMods(channelId, twitchAuthToken)
      expect(result).toEqual(channel.mods)
    })

    test('expect mods endpoint paginates', async () => {
      const newMods = ['newMod1']
      const pagination = { hello: 'world' }
      getModsEndpoint.mockReturnValueOnce({ data: newMods, pagination })

      const result = await getChannelMods(channelId, twitchAuthToken)
      expect(result).toEqual([...newMods, ...mods])
      expect(getModsEndpoint).toHaveBeenCalledWith(
        new URLSearchParams({ after: JSON.stringify(pagination), broadcaster_id: '123456', first: '100' })
      )
      expect(getModsEndpoint).toHaveBeenCalledWith(new URLSearchParams({ broadcaster_id: '123456', first: '100' }))
    })

    test('expect error on invalid token', async () => {
      await expect(getChannelMods(channelId, 'invalid-token')).rejects.toBeDefined()
    })

    test('expect error when endpoint rejects', async () => {
      getModsEndpoint.mockReturnValueOnce(undefined)
      await expect(getChannelMods(channelId, twitchAuthToken)).rejects.toBeDefined()
    })
  })

  describe('getChannelInfo', () => {
    const displayName = 'biggerthansheexpected'
    const offlinePicUrl = 'http://dbowland.com/offline.png'
    const profilePicUrl = 'http://dbowland.com/profile.png'

    const getChannelInfoEndpoint = jest.fn().mockReturnValue({
      data: [
        {
          display_name: displayName,
          offline_image_url: offlinePicUrl,
          profile_image_url: profilePicUrl,
        },
      ],
    })

    beforeAll(() => {
      server.use(
        rest.get(`${apiHost}/helix/users`, async (req, res, ctx) => {
          if (
            `Bearer ${twitchAuthToken}` !== req.headers.get('Authorization') ||
            twitchClientId !== req.headers.get('Client-ID')
          ) {
            return res(ctx.status(401))
          }

          const body = getChannelInfoEndpoint(req.url.searchParams)
          return res(body ? ctx.json(body) : ctx.status(400))
        })
      )
    })

    test('expect info endpoint to be called', async () => {
      await getChannelInfo(channelId, twitchAuthToken)
      expect(getChannelInfoEndpoint).toHaveBeenCalledWith(new URLSearchParams({ id: '123456' }))
    })

    test('expect info endpoint returns info', async () => {
      const result = await getChannelInfo(channelId, twitchAuthToken)
      expect(result).toEqual({
        name: 'biggerthansheexpected',
        pic: 'http://dbowland.com/profile.png',
      })
    })

    test('expect info endpoint returns info with offline URL if no profile URL', async () => {
      getChannelInfoEndpoint.mockReturnValueOnce({
        data: [
          {
            display_name: displayName,
            offline_image_url: offlinePicUrl,
          },
        ],
      })
      const result = await getChannelInfo(channelId, twitchAuthToken)
      expect(result).toEqual({
        name: 'biggerthansheexpected',
        pic: 'http://dbowland.com/offline.png',
      })
    })

    test('expect error on invalid token', async () => {
      await expect(getChannelInfo(channelId, 'invalid-token')).rejects.toBeDefined()
    })

    test('expect error when endpoint rejects', async () => {
      getChannelInfoEndpoint.mockReturnValueOnce(undefined)
      await expect(getChannelInfo(channelId, twitchAuthToken)).rejects.toBeDefined()
    })
  })

  describe('validateToken', () => {
    test('expect validate token endpoint to be called', async () => {
      await validateToken(twitchAuthToken)
      expect(getValidateEndpoint).toHaveBeenCalled()
    })

    test('expect user returned from validate endpoint', async () => {
      const validatedUser = await validateToken(twitchAuthToken)
      expect(validatedUser).toEqual(user)
    })

    test('expect undefined returned when invalid token', async () => {
      const validatedUser = await validateToken('invalid-token')
      expect(validatedUser).toEqual(undefined)
    })

    test('expect error when endpoint errors', async () => {
      getValidateEndpoint.mockReturnValueOnce(undefined)
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
      expect(getValidateEndpoint).toHaveBeenCalled()
    })

    test('expect getUserFromEvent returns header values when internal', async () => {
      const result = await getUserFromEvent(eventInternal)
      expect(result).toEqual(expect.objectContaining({ id: user.id, name: user.name }))
      expect(getValidateEndpoint).not.toHaveBeenCalled()
    })
  })
})
