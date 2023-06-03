import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as twitch from '@services/twitch'
import { channel, channelId, twitchAuthToken, user } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/post-update-mods.json'
import { postUpdateModsHandler } from '@handlers/post-update-mods'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/twitch')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('post-update-mods', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2
  const newMods = [
    {
      user_id: '12345',
      user_login: 'newMod1',
      user_name: 'newMod1',
    },
    {
      user_id: '67890',
      user_login: 'newMod2',
      user_name: 'newMod2',
    },
  ]

  beforeAll(() => {
    mocked(dynamodb).getChannelById.mockResolvedValue(channel)
    mocked(events).extractTokenFromEvent.mockReturnValue(twitchAuthToken)
    mocked(twitch).getChannelMods.mockResolvedValue(newMods)
    mocked(twitch).validateToken.mockResolvedValue(user)
  })

  describe('postUpdateModsHandler', () => {
    test('expect INTERNAL_SERVER_ERROR when extractTokenFromEvent throws', async () => {
      mocked(events).extractTokenFromEvent.mockImplementationOnce(() => {
        throw new Error()
      })

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect INTERNAL_SERVER_ERROR when validateToken rejects', async () => {
      mocked(twitch).validateToken.mockRejectedValueOnce(undefined)

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect FORBIDDEN when token is invalid', async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce(undefined)

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test("expect FORBIDDEN when user doesn't match channel", async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce({ ...user, id: 'not-valid' })

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect NOT_FOUND when getChannelById rejects', async () => {
      mocked(dynamodb).getChannelById.mockRejectedValueOnce(undefined)

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(status.NOT_FOUND)
    })

    test('expect INTERNAL_SERVER_ERROR when getChannelMods rejects', async () => {
      mocked(twitch).getChannelMods.mockRejectedValueOnce(undefined)

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect INTERNAL_SERVER_ERROR when setChannelById rejects', async () => {
      mocked(dynamodb).setChannelById.mockRejectedValueOnce(undefined)

      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect channelId passed to getChannelById', async () => {
      await postUpdateModsHandler(event)
      expect(mocked(dynamodb).getChannelById).toHaveBeenCalledWith(channelId)
    })

    test('expect channelId and token passed to getChannelMods', async () => {
      await postUpdateModsHandler(event)
      expect(mocked(twitch).getChannelMods).toHaveBeenCalledWith(channelId, twitchAuthToken)
    })

    test('expect updated channel passed to setChannelById', async () => {
      const updatedChannel = { ...channel, mods: newMods }
      await postUpdateModsHandler(event)
      expect(mocked(dynamodb).setChannelById).toHaveBeenCalledWith(channelId, updatedChannel)
    })

    test('expect NO_CONTENT', async () => {
      const result = await postUpdateModsHandler(event)
      expect(result).toEqual(status.NO_CONTENT)
    })
  })
})
