import { buildId, buildKiller, buildSurvivor, buildToken, channel, channelId, submitter } from '../__mocks__'
import {
  deleteBuildById,
  deleteChannelById,
  deleteTokenById,
  getBuildById,
  getChannelById,
  getTokenById,
  queryBuildsByChannelId,
  scanChannels,
  scanExpiredBuildIds,
  scanExpiredTokens,
  setBuildById,
  setChannelById,
  setTokenById,
  updateChannelCounts,
} from '@services/dynamodb'

const mockSend = jest.fn()
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DeleteItemCommand: jest.fn().mockImplementation((x) => x),
  DynamoDB: jest.fn(() => ({
    send: (...args) => mockSend(...args),
  })),
  GetItemCommand: jest.fn().mockImplementation((x) => x),
  PutItemCommand: jest.fn().mockImplementation((x) => x),
  QueryCommand: jest.fn().mockImplementation((x) => x),
  ScanCommand: jest.fn().mockImplementation((x) => x),
}))
jest.mock('@utils/logging', () => ({
  xrayCapture: jest.fn().mockImplementation((x) => x),
}))

describe('dynamodb', () => {
  describe('deleteBuildById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      await deleteBuildById(channelId, buildId)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            BuildId: { S: buildId },
            ChannelId: { S: channelId },
          },
          TableName: 'build-table',
        }),
      )
    })
  })

  describe('deleteChannelById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      await deleteChannelById(channelId)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            ChannelId: { S: channelId },
          },
          TableName: 'channel-table',
        }),
      )
    })
  })

  describe('deleteTokenById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      await deleteTokenById(channelId, buildToken.value)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            ChannelId: { S: channelId },
            Token: { S: buildToken.value },
          },
          TableName: 'token-table',
        }),
      )
    })
  })

  describe('getBuildById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Item: { Data: { S: JSON.stringify(buildKiller) } },
      })

      const result = await getBuildById(channelId, buildId)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            BuildId: { S: buildId },
            ChannelId: { S: channelId },
          },
          TableName: 'build-table',
        }),
      )
      expect(result).toEqual(buildKiller)
    })
  })

  describe('getChannelById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Item: { Data: { S: JSON.stringify(channel) } },
      })

      const result = await getChannelById(channelId)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            ChannelId: { S: channelId },
          },
          TableName: 'channel-table',
        }),
      )
      expect(result).toEqual(channel)
    })
  })

  describe('getTokenById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Item: { Submitter: { S: submitter } },
      })

      const result = await getTokenById(channelId, buildToken.value)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Key: {
            ChannelId: { S: channelId },
            Token: { S: buildToken.value },
          },
          TableName: 'token-table',
        }),
      )
      expect(result).toEqual({ submitter })
    })
  })

  describe('queryBuildsByChannelId', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            BuildId: { S: buildId },
            ChannelId: { S: channelId },
            Data: { S: JSON.stringify(buildSurvivor) },
          },
        ],
      })

      const result = await queryBuildsByChannelId(channelId)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: { ':v1': { S: channelId } },
          KeyConditionExpression: 'ChannelId = :v1',
          TableName: 'build-table',
        }),
      )
      expect(result).toEqual([
        {
          channelId,
          data: buildSurvivor,
          id: buildId,
        },
      ])
    })
  })

  describe('scanChannels', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            ChannelId: { S: channelId },
            Data: { S: JSON.stringify(channel) },
          },
        ],
      })

      const result = await scanChannels()
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          AttributesToGet: ['ChannelId', 'Data'],
          TableName: 'channel-table',
        }),
      )
      expect(result).toEqual([
        {
          data: channel,
          id: channelId,
        },
      ])
    })
  })

  describe('scanExpiredBuildIds', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            BuildId: { S: buildId },
            ChannelId: { S: channelId },
          },
        ],
      })

      const result = await scanExpiredBuildIds()
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: {
            ':v1': {
              N: '1',
            },
            ':v2': {
              N: expect.anything(),
            },
          },
          FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
          IndexName: 'ExpirationIndex',
          TableName: 'build-table',
        }),
      )
      expect(result).toEqual([
        {
          buildId,
          channelId,
        },
      ])
    })
  })

  describe('scanExpiredTokens', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      mockSend.mockResolvedValueOnce({
        Items: [
          {
            ChannelId: { S: channelId },
            Token: { S: buildToken.value },
          },
        ],
      })

      const result = await scanExpiredTokens()
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          ExpressionAttributeValues: {
            ':v1': {
              N: '1',
            },
            ':v2': {
              N: expect.anything(),
            },
          },
          FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
          IndexName: 'ExpirationIndex',
          TableName: 'token-table',
        }),
      )
      expect(result).toEqual([
        {
          channelId,
          token: buildToken.value,
        },
      ])
    })
  })

  describe('setBuildById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      const modifiedBuild = { ...buildKiller, expiration: undefined }

      await setBuildById(channelId, buildId, modifiedBuild)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: {
            BuildId: {
              S: buildId,
            },
            ChannelId: {
              S: channelId,
            },
            Data: {
              S: JSON.stringify(modifiedBuild),
            },
            Expiration: {
              N: '0',
            },
          },
          TableName: 'build-table',
        }),
      )
    })
  })

  describe('setChannelById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      await setChannelById(channelId, channel)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: {
            ChannelId: {
              S: channelId,
            },
            Data: {
              S: JSON.stringify(channel),
            },
          },
          TableName: 'channel-table',
        }),
      )
    })
  })

  describe('setTokenById', () => {
    test('should call DynamoDB with the correct arguments', async () => {
      const expiration = 8675309

      await setTokenById(channelId, buildToken.value, expiration, submitter)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: {
            ChannelId: {
              S: channelId,
            },
            Expiration: {
              N: `${expiration}`,
            },
            Submitter: {
              S: submitter,
            },
            Token: {
              S: buildToken.value,
            },
          },
          TableName: 'token-table',
        }),
      )
    })
  })

  describe('updateChannelCounts', () => {
    test('expect channel counts recalculated', async () => {
      mockSend
        .mockResolvedValueOnce({
          Items: [
            { BuildId: { S: buildId }, ChannelId: { S: channelId }, Data: { S: JSON.stringify(buildKiller) } },
            {
              BuildId: { S: 'tfvdertyujmytf' },
              ChannelId: { S: channelId },
              Data: { S: JSON.stringify(buildSurvivor) },
            },
          ],
        })
        .mockResolvedValueOnce({ Item: { Data: { S: JSON.stringify(channel) } } })
      const counts = { completed: 1, pending: 1 }

      const result = await updateChannelCounts(channelId)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          Item: {
            ChannelId: {
              S: channelId,
            },
            Data: {
              S: expect.anything(),
            },
          },
          TableName: 'channel-table',
        }),
      )
      expect(result).toEqual(counts)
    })

    test('expect last modified not updated', async () => {
      mockSend
        .mockResolvedValueOnce({
          Items: [
            { BuildId: { S: buildId }, ChannelId: { S: channelId }, Data: { S: JSON.stringify(buildKiller) } },
            {
              BuildId: { S: 'tfvdertyujmytf' },
              ChannelId: { S: channelId },
              Data: { S: JSON.stringify(buildSurvivor) },
            },
          ],
        })
        .mockResolvedValueOnce({ Item: { Data: { S: JSON.stringify(channel) } } })
      const counts = { completed: 1, pending: 1 }
      const channelUpdatedCounts = { ...channel, counts }

      const result = await updateChannelCounts(channelId, false)
      expect(mockSend).toHaveBeenCalledWith({
        Item: {
          ChannelId: {
            S: channelId,
          },
          Data: {
            S: JSON.stringify(channelUpdatedCounts),
          },
        },
        TableName: 'channel-table',
      })
      expect(result).toEqual(counts)
    })
  })
})
