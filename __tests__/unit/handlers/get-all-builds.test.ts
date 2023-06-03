import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { buildBatch, buildId, buildKiller, channelId } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-all-builds.json'
import { getAllBuildsHandler } from '@handlers/get-all-builds'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('get-all-builds', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).queryBuildsByChannelId.mockResolvedValue(buildBatch)
  })

  describe('getAllBuildsHandler', () => {
    test('expect INTERNAL_SERVER_ERROR on scanSessions reject', async () => {
      mocked(dynamodb).queryBuildsByChannelId.mockRejectedValueOnce(undefined)

      const result = await getAllBuildsHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect OK and data', async () => {
      const result = await getAllBuildsHandler(event)
      expect(result).toEqual({ ...status.OK, body: JSON.stringify([{ channelId, data: buildKiller, id: buildId }]) })
    })
  })
})
