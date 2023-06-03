import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { channel, channelId } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-by-id.json'
import { getByIdHandler } from '@handlers/get-by-id'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('get-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getChannelById.mockResolvedValue(channel)
  })

  describe('getByIdHandler', () => {
    test('expect NOT_FOUND on getSessionById reject', async () => {
      mocked(dynamodb).getChannelById.mockRejectedValueOnce(undefined)

      const result = await getByIdHandler(event)
      expect(result).toEqual(status.NOT_FOUND)
    })

    test('expect OK when id exists', async () => {
      const result = await getByIdHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify({ ...channel, channelId }) })
    })
  })
})
