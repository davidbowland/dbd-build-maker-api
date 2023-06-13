import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as twitch from '@services/twitch'
import { channel, channelId, channelInfo, mods, twitchAuthToken, user } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/post-channel.json'
import { postChannelHandler } from '@handlers/post-channel'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/twitch')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('post-channel', () => {
  const { lastModified: _, ...channelNoModified } = channel
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(events).extractTokenFromEvent.mockReturnValue(twitchAuthToken)
    mocked(twitch).getChannelInfo.mockResolvedValue(channelInfo)
    mocked(twitch).getChannelMods.mockResolvedValue(mods)
    mocked(twitch).validateToken.mockResolvedValue(user)
  })

  describe('postChannelHandler', () => {
    test('expect BAD_REQUEST when extract token fails', async () => {
      mocked(events).extractTokenFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })

      const result = await postChannelHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
    })

    test('expect INTERNAL_SERVER_ERROR on validateToken reject', async () => {
      mocked(twitch).validateToken.mockRejectedValueOnce(undefined)

      const result = await postChannelHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect FORBIDDEN when validateToken return undefined', async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce(undefined)

      const result = await postChannelHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect INTERNAL_SERVER_ERROR on getChannelInfo reject', async () => {
      mocked(twitch).getChannelInfo.mockRejectedValueOnce(undefined)

      const result = await postChannelHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect INTERNAL_SERVER_ERROR on getChannelMods reject', async () => {
      mocked(twitch).getChannelMods.mockRejectedValueOnce(undefined)

      const result = await postChannelHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect channel passed to setChannelById', async () => {
      await postChannelHandler(event)
      expect(mocked(dynamodb).setChannelById).toHaveBeenCalledWith(
        channelId,
        expect.objectContaining(channelNoModified)
      )
    })

    test('expect channel passed to updateChannelCounts', async () => {
      await postChannelHandler(event)
      expect(mocked(dynamodb).updateChannelCounts).toHaveBeenCalledWith(channelId)
    })

    test('expect INTERNAL_SERVER_ERROR on setChannelById reject', async () => {
      mocked(dynamodb).setChannelById.mockRejectedValueOnce(undefined)

      const result = await postChannelHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect CREATED and body', async () => {
      const result = await postChannelHandler(event)

      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(JSON.parse(result.body)).toEqual(
        expect.objectContaining({
          ...channelNoModified,
          channelId,
        })
      )
    })
  })
})
