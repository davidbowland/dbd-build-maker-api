import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import { buildId, buildKiller, channel, channelId, submitter } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/put-build.json'
import { putBuildHandler } from '@handlers/put-build'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('put-build', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getChannelById.mockResolvedValue(channel)
    mocked(dynamodb).getTokenById.mockResolvedValue({ submitter })
    mocked(events).extractBuildFromEvent.mockReturnValue(buildKiller)
  })

  describe('putBuildHandler', () => {
    test('expect FORBIDDEN when getTokenById rejects', async () => {
      mocked(dynamodb).getTokenById.mockRejectedValueOnce(undefined)
      const result = await putBuildHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect INTERNAL_SERVER_ERROR when getChannelById rejects', async () => {
      mocked(dynamodb).getChannelById.mockRejectedValueOnce(undefined)
      const result = await putBuildHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect BAD_REQUEST when extract build fails', async () => {
      mocked(events).extractBuildFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await putBuildHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
    })

    test('expect build passed to setBuildById', async () => {
      await putBuildHandler(event)
      expect(mocked(dynamodb).setBuildById).toHaveBeenCalledWith(channelId, buildId, { ...buildKiller, submitter })
    })

    test('expect INTERNAL_SERVER_ERROR on setBuildById reject', async () => {
      mocked(dynamodb).setBuildById.mockRejectedValueOnce(undefined)
      const result = await putBuildHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect INTERNAL_SERVER_ERROR on deleteTokenById reject', async () => {
      mocked(dynamodb).deleteTokenById.mockRejectedValueOnce(undefined)
      const result = await putBuildHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect OK and body', async () => {
      const result = await putBuildHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual({ ...buildKiller, submitter })
    })
  })
})
