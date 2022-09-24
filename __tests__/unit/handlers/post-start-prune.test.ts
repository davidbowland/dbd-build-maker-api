import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { buildId, buildToken, channelId } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/post-start-prune.json'
import { postStartPruneHandler } from '@handlers/post-start-prune'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@utils/logging')

describe('post-start-prune', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).deleteBuildById.mockResolvedValue(undefined)
    mocked(dynamodb).deleteTokenById.mockResolvedValue(undefined)
    mocked(dynamodb).scanExpiredBuildIds.mockResolvedValue([
      {
        buildId,
        channelId,
      },
    ])
    mocked(dynamodb).scanExpiredTokens.mockResolvedValue([
      {
        channelId,
        token: buildToken.value,
      },
    ])
  })

  describe('postStartPruneHandler', () => {
    test('expect INTERNAL_SERVER_ERROR when scanExpiredBuildIds rejects', async () => {
      mocked(dynamodb).scanExpiredBuildIds.mockRejectedValueOnce(undefined)
      const result = await postStartPruneHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect INTERNAL_SERVER_ERROR when deleteBuildById rejects', async () => {
      mocked(dynamodb).deleteBuildById.mockRejectedValueOnce(undefined)
      const result = await postStartPruneHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect INTERNAL_SERVER_ERROR when scanExpiredTokens rejects', async () => {
      mocked(dynamodb).scanExpiredTokens.mockRejectedValueOnce(undefined)
      const result = await postStartPruneHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect INTERNAL_SERVER_ERROR when deleteTokenById rejects', async () => {
      mocked(dynamodb).deleteTokenById.mockRejectedValueOnce(undefined)
      const result = await postStartPruneHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })

    test('expect channelId and buildId passed to deleteDecisionById', async () => {
      await postStartPruneHandler(event)
      expect(mocked(dynamodb).deleteBuildById).toHaveBeenCalledWith(channelId, buildId)
    })

    test('expect channelId and token passed to deleteDecisionById', async () => {
      await postStartPruneHandler(event)
      expect(mocked(dynamodb).deleteTokenById).toHaveBeenCalledWith(channelId, buildToken.value)
    })

    test('expect channelId and token passed to updateChannelCounts', async () => {
      await postStartPruneHandler(event)
      expect(mocked(dynamodb).updateChannelCounts).toHaveBeenCalledWith(channelId)
    })

    test('expect NO_CONTENT', async () => {
      const result = await postStartPruneHandler(event)
      expect(result).toEqual(status.NO_CONTENT)
    })
  })
})
