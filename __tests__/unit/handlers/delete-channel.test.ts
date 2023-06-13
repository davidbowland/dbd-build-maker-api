import * as dynamodb from '@services/dynamodb'
import * as twitch from '@services/twitch'
import { channel, channelId, user } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import { deleteChannelByIdHandler } from '@handlers/delete-channel'
import eventJson from '@events/delete-channel.json'
import { mocked } from 'jest-mock'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/twitch')
jest.mock('@utils/logging')

describe('delete-channel', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getChannelById.mockResolvedValue(channel)
    mocked(twitch).getUserFromEvent.mockResolvedValue(user)
  })

  describe('deleteChannelByIdHandler', () => {
    test("expect FORBIDDEN when user doesn't match", async () => {
      mocked(twitch).getUserFromEvent.mockResolvedValueOnce({ ...user, id: 'something-that-does-not-match' })

      const result = await deleteChannelByIdHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect INTERNAL_SERVER_ERROR on getUserFromEvent reject', async () => {
      mocked(twitch).getUserFromEvent.mockRejectedValueOnce(undefined)

      const result = await deleteChannelByIdHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect deleteDataById called when getDataById resolves', async () => {
      await deleteChannelByIdHandler(event)
      expect(mocked(dynamodb).deleteChannelById).toHaveBeenCalledWith(channelId)
    })

    test('expect deleteDataById not to be called when getDataById rejects', async () => {
      mocked(dynamodb).getChannelById.mockRejectedValueOnce(undefined)

      await deleteChannelByIdHandler(event)
      expect(mocked(dynamodb).deleteChannelById).toHaveBeenCalledTimes(0)
    })

    test('expect INTERNAL_SERVER_ERROR on deleteDataById reject', async () => {
      mocked(dynamodb).deleteChannelById.mockRejectedValueOnce(undefined)

      const result = await deleteChannelByIdHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect OK when index exists', async () => {
      const result = await deleteChannelByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify(channel) })
    })

    test('expect NO_CONTENT when index does not exist', async () => {
      mocked(dynamodb).getChannelById.mockRejectedValueOnce(undefined)

      const result = await deleteChannelByIdHandler(event)
      expect(result).toEqual(status.NO_CONTENT)
    })
  })
})
