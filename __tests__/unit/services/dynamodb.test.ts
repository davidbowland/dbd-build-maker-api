import { buildId, buildKiller, buildToken, channel, channelId, submitter } from '../__mocks__'
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
} from '@services/dynamodb'

const mockDeleteItem = jest.fn()
const mockGetItem = jest.fn()
const mockPutItem = jest.fn()
const mockQueryTable = jest.fn()
const mockScanTable = jest.fn()
jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    deleteItem: (...args) => ({ promise: () => mockDeleteItem(...args) }),
    getItem: (...args) => ({ promise: () => mockGetItem(...args) }),
    putItem: (...args) => ({ promise: () => mockPutItem(...args) }),
    query: (...args) => ({ promise: () => mockQueryTable(...args) }),
    scan: (...args) => ({ promise: () => mockScanTable(...args) }),
  })),
}))
jest.mock('@utils/logging', () => ({
  xrayCapture: jest.fn().mockImplementation((x) => x),
}))

describe('dynamodb', () => {
  describe('deleteBuildById', () => {
    test('expect channelId and buildId passed to delete', async () => {
      await deleteBuildById(channelId, buildId)
      expect(mockDeleteItem).toHaveBeenCalledWith({
        Key: {
          BuildId: {
            S: `${buildId}`,
          },
          ChannelId: {
            S: `${channelId}`,
          },
        },
        TableName: 'build-table',
      })
    })
  })

  describe('deleteChannelById', () => {
    test('expect channelId passed to delete', async () => {
      await deleteChannelById(channelId)
      expect(mockDeleteItem).toHaveBeenCalledWith({
        Key: {
          ChannelId: {
            S: `${channelId}`,
          },
        },
        TableName: 'channel-table',
      })
    })
  })

  describe('deleteTokenById', () => {
    test('expect channelId and token passed to delete', async () => {
      await deleteTokenById(channelId, buildToken.value)
      expect(mockDeleteItem).toHaveBeenCalledWith({
        Key: {
          ChannelId: {
            S: `${channelId}`,
          },
          Token: {
            S: `${buildToken.value}`,
          },
        },
        TableName: 'token-table',
      })
    })
  })

  describe('getBuildById', () => {
    beforeAll(() => {
      mockGetItem.mockResolvedValue({ Item: { Data: { S: JSON.stringify(buildKiller) } } })
    })

    test('expect id passed to get', async () => {
      await getBuildById(channelId, buildId)
      expect(mockGetItem).toHaveBeenCalledWith({
        Key: {
          BuildId: {
            S: `${buildId}`,
          },
          ChannelId: {
            S: `${channelId}`,
          },
        },
        TableName: 'build-table',
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await getBuildById(channelId, buildId)
      expect(result).toEqual(buildKiller)
    })
  })

  describe('getChannelById', () => {
    beforeAll(() => {
      mockGetItem.mockResolvedValue({ Item: { Data: { S: JSON.stringify(channel) } } })
    })

    test('expect id passed to get', async () => {
      await getChannelById(channelId)
      expect(mockGetItem).toHaveBeenCalledWith({
        Key: {
          ChannelId: {
            S: `${channelId}`,
          },
        },
        TableName: 'channel-table',
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await getChannelById(channelId)
      expect(result).toEqual(channel)
    })
  })

  describe('getTokenById', () => {
    beforeAll(() => {
      mockGetItem.mockResolvedValue({ Item: { Submitter: { S: submitter } } })
    })

    test('expect id passed to get', async () => {
      await getTokenById(channelId, buildToken.value)
      expect(mockGetItem).toHaveBeenCalledWith({
        Key: {
          ChannelId: {
            S: `${channelId}`,
          },
          Token: {
            S: `${buildToken.value}`,
          },
        },
        TableName: 'token-table',
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await getTokenById(channelId, buildToken.value)
      expect(result).toEqual({ submitter })
    })
  })

  describe('queryBuildsByChannelId', () => {
    beforeAll(() => {
      mockQueryTable.mockResolvedValue({
        Items: [
          { BuildId: { S: `${buildId}` }, ChannelId: { S: `${channelId}` }, Data: { S: JSON.stringify(buildKiller) } },
        ],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await queryBuildsByChannelId(channelId)
      expect(result).toEqual([
        {
          channelId,
          data: buildKiller,
          id: buildId,
        },
      ])
    })

    test('expect empty object with no data returned', async () => {
      mockQueryTable.mockResolvedValueOnce({ Items: [] })
      const result = await queryBuildsByChannelId(channelId)
      expect(result).toEqual([])
    })
  })

  describe('scanChannels', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ ChannelId: { S: `${channelId}` }, Data: { S: JSON.stringify(channel) } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanChannels()
      expect(result).toEqual([{ data: channel, id: channelId }])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanChannels()
      expect(result).toEqual([])
    })
  })

  describe('scanExpiredBuildIds', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ BuildId: { S: `${buildId}` }, ChannelId: { S: `${channelId}` } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanExpiredBuildIds()
      expect(result).toEqual([
        {
          buildId,
          channelId,
        },
      ])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanExpiredBuildIds()
      expect(result).toEqual([])
    })
  })

  describe('scanExpiredTokens', () => {
    beforeAll(() => {
      mockScanTable.mockResolvedValue({
        Items: [{ ChannelId: { S: `${channelId}` }, Token: { S: `${buildToken.value}` } }],
      })
    })

    test('expect data parsed and returned', async () => {
      const result = await scanExpiredTokens()
      expect(result).toEqual([
        {
          channelId,
          token: buildToken.value,
        },
      ])
    })

    test('expect empty object with no data returned', async () => {
      mockScanTable.mockResolvedValueOnce({ Items: [] })
      const result = await scanExpiredTokens()
      expect(result).toEqual([])
    })
  })

  describe('setBuildById', () => {
    test('expect index and data passed to put', async () => {
      await setBuildById(channelId, buildId, buildKiller)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          BuildId: {
            S: `${buildId}`,
          },
          ChannelId: {
            S: `${channelId}`,
          },
          Data: {
            S: JSON.stringify(buildKiller),
          },
          Expiration: {
            N: `${buildKiller.expiration}`,
          },
        },
        TableName: 'build-table',
      })
    })

    test('expect expiration defaults to 0', async () => {
      const noExpirationBuild = { ...buildKiller, expiration: undefined }
      await setBuildById(channelId, buildId, noExpirationBuild)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          BuildId: {
            S: `${buildId}`,
          },
          ChannelId: {
            S: `${channelId}`,
          },
          Data: {
            S: JSON.stringify(noExpirationBuild),
          },
          Expiration: {
            N: '0',
          },
        },
        TableName: 'build-table',
      })
    })
  })

  describe('setChannelById', () => {
    test('expect index and data passed to put', async () => {
      await setChannelById(channelId, channel)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          ChannelId: {
            S: `${channelId}`,
          },
          Data: {
            S: JSON.stringify(channel),
          },
        },
        TableName: 'channel-table',
      })
    })
  })

  describe('setTokenById', () => {
    test('expect index and data passed to put', async () => {
      await setTokenById(channelId, buildToken.value, buildToken.expiration, submitter)
      expect(mockPutItem).toHaveBeenCalledWith({
        Item: {
          ChannelId: {
            S: `${channelId}`,
          },
          Expiration: {
            N: `${buildToken.expiration}`,
          },
          Submitter: {
            S: `${submitter}`,
          },
          Token: {
            S: `${buildToken.value}`,
          },
        },
        TableName: 'token-table',
      })
    })
  })
})
