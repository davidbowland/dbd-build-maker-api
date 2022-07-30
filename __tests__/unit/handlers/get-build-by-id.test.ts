import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { APIGatewayProxyEventV2 } from '@types'
import { buildKiller } from '../__mocks__'
import eventJson from '@events/get-build-by-id.json'
import { getBuildByIdHandler } from '@handlers/get-build-by-id'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('get-build-by-id', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getBuildById.mockResolvedValue(buildKiller)
  })

  describe('getBuildByIdHandler', () => {
    test('expect NOT_FOUND when getBuildById rejects', async () => {
      mocked(dynamodb).getBuildById.mockRejectedValueOnce(undefined)
      const result = await getBuildByIdHandler(event)
      expect(result).toEqual(status.NOT_FOUND)
    })

    test('expect OK and results when id exists', async () => {
      const result = await getBuildByIdHandler(event)
      expect(result).toEqual({
        ...status.OK,
        body: JSON.stringify(buildKiller),
      })
    })
  })
})
