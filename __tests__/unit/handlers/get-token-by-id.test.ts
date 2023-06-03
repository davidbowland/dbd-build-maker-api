import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-token-by-id.json'
import { getTokenByIdHandler } from '@handlers/get-token-by-id'
import status from '@utils/status'
import { submitter } from '../__mocks__'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('get-token-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getTokenById.mockResolvedValue({ submitter })
  })

  describe('getTokenByIdHandler', () => {
    test('expect NOT_FOUND when getTokenById rejects', async () => {
      mocked(dynamodb).getTokenById.mockRejectedValueOnce(undefined)

      const result = await getTokenByIdHandler(event)
      expect(result).toEqual(status.NOT_FOUND)
    })

    test('expect OK and results when id exists', async () => {
      const result = await getTokenByIdHandler(event)
      expect(result).toEqual({
        ...status.OK,
        body: JSON.stringify({ submitter }),
      })
    })
  })
})
