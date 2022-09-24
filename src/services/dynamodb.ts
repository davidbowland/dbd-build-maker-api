import { DynamoDB } from 'aws-sdk'

import { Build, BuildBatch, Channel, ChannelBatch, ChannelCounts } from '../types'
import { dynamodbBuildTableName, dynamodbChannelTableName, dynamodbTokenTableName } from '../config'
import { xrayCapture } from '../utils/logging'

const dynamodb = xrayCapture(new DynamoDB({ apiVersion: '2012-08-10' }))

/* Delete item */

export const deleteBuildById = (channelId: string, buildId: string): Promise<DynamoDB.Types.DeleteItemOutput> =>
  dynamodb
    .deleteItem({
      Key: {
        BuildId: {
          S: `${buildId}`,
        },
        ChannelId: {
          S: `${channelId}`,
        },
      },
      TableName: dynamodbBuildTableName,
    })
    .promise()

export const deleteChannelById = (channelId: string): Promise<DynamoDB.Types.DeleteItemOutput> =>
  dynamodb
    .deleteItem({
      Key: {
        ChannelId: {
          S: `${channelId}`,
        },
      },
      TableName: dynamodbChannelTableName,
    })
    .promise()

export const deleteTokenById = (channelId: string, token: string): Promise<DynamoDB.Types.DeleteItemOutput> =>
  dynamodb
    .deleteItem({
      Key: {
        ChannelId: {
          S: `${channelId}`,
        },
        Token: {
          S: `${token}`,
        },
      },
      TableName: dynamodbTokenTableName,
    })
    .promise()

/* Get single item */

export const getBuildById = (channelId: string, buildId: string): Promise<Build> =>
  dynamodb
    .getItem({
      Key: {
        BuildId: {
          S: `${buildId}`,
        },
        ChannelId: {
          S: `${channelId}`,
        },
      },
      TableName: dynamodbBuildTableName,
    })
    .promise()
    .then((response) => JSON.parse(response.Item.Data.S))

export const getChannelById = (channelId: string): Promise<Channel> =>
  dynamodb
    .getItem({
      Key: {
        ChannelId: {
          S: `${channelId}`,
        },
      },
      TableName: dynamodbChannelTableName,
    })
    .promise()
    .then((response) => JSON.parse(response.Item.Data.S))

export const getTokenById = (channelId: string, token: string): Promise<{ submitter: string }> =>
  dynamodb
    .getItem({
      Key: {
        ChannelId: {
          S: `${channelId}`,
        },
        Token: {
          S: `${token}`,
        },
      },
      TableName: dynamodbTokenTableName,
    })
    .promise()
    .then((response) => ({ submitter: response.Item.Submitter.S }))

/* Query builds by channel */

const getItemsFromBuildQuery = (response: DynamoDB.Types.ScanOutput): BuildBatch[] =>
  response.Items.map((item) => ({
    channelId: item.ChannelId.S,
    data: JSON.parse(item.Data.S),
    id: item.BuildId.S,
  }))

export const queryBuildsByChannelId = (channelId: string): Promise<BuildBatch[]> =>
  dynamodb
    .query({
      ExpressionAttributeValues: {
        ':v1': {
          S: channelId,
        },
      },
      KeyConditionExpression: 'ChannelId = :v1',
      TableName: dynamodbBuildTableName,
    })
    .promise()
    .then((response) => getItemsFromBuildQuery(response))

/* Scan for all items */

const getChannelsFromScan = (response: DynamoDB.Types.ScanOutput): ChannelBatch[] =>
  response.Items.map((item) => ({ data: JSON.parse(item.Data.S), id: item.ChannelId.S }))

export const scanChannels = (): Promise<ChannelBatch[]> =>
  dynamodb
    .scan({
      AttributesToGet: ['ChannelId', 'Data'],
      TableName: dynamodbChannelTableName,
    })
    .promise()
    .then((response) => getChannelsFromScan(response))

/* Scan for expired items */

export const scanExpiredBuildIds = (): Promise<{ buildId: string; channelId: string }[]> =>
  dynamodb
    .scan({
      ExpressionAttributeValues: {
        ':v1': {
          N: '1',
        },
        ':v2': {
          N: `${new Date().getTime()}`,
        },
      },
      FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
      IndexName: 'ExpirationIndex',
      TableName: dynamodbBuildTableName,
    })
    .promise()
    .then((response) => response.Items.map((item) => ({ buildId: item.BuildId.S, channelId: item.ChannelId.S })))

export const scanExpiredTokens = (): Promise<{ channelId: string; token: string }[]> =>
  dynamodb
    .scan({
      ExpressionAttributeValues: {
        ':v1': {
          N: '1',
        },
        ':v2': {
          N: `${new Date().getTime()}`,
        },
      },
      FilterExpression: 'Expiration BETWEEN :v1 AND :v2',
      IndexName: 'ExpirationIndex',
      TableName: dynamodbTokenTableName,
    })
    .promise()
    .then((response) => response.Items.map((item) => ({ channelId: item.ChannelId.S, token: item.Token.S })))

/* Set item */

export const setBuildById = (channelId: string, buildId: string, data: Build): Promise<DynamoDB.Types.PutItemOutput> =>
  dynamodb
    .putItem({
      Item: {
        BuildId: {
          S: `${buildId}`,
        },
        ChannelId: {
          S: `${channelId}`,
        },
        Data: {
          S: JSON.stringify(data),
        },
        Expiration: {
          N: `${data.expiration ?? 0}`,
        },
      },
      TableName: dynamodbBuildTableName,
    })
    .promise()

export const setChannelById = (channelId: string, data: Channel): Promise<DynamoDB.Types.PutItemOutput> =>
  dynamodb
    .putItem({
      Item: {
        ChannelId: {
          S: `${channelId}`,
        },
        Data: {
          S: JSON.stringify(data),
        },
      },
      TableName: dynamodbChannelTableName,
    })
    .promise()

export const setTokenById = (
  channelId: string,
  token: string,
  expiration: number,
  submitter: string
): Promise<DynamoDB.Types.PutItemOutput> =>
  dynamodb
    .putItem({
      Item: {
        ChannelId: {
          S: `${channelId}`,
        },
        Expiration: {
          N: `${expiration}`,
        },
        Submitter: {
          S: `${submitter}`,
        },
        Token: {
          S: `${token}`,
        },
      },
      TableName: dynamodbTokenTableName,
    })
    .promise()

/* Update counts */

export const updateChannelCounts = async (channelId: string): Promise<ChannelCounts> => {
  const builds = await queryBuildsByChannelId(channelId)
  const counts = builds.reduce(
    (previous, current) => {
      if (current.data.completed) {
        return { ...previous, completed: previous.completed + 1 }
      }
      return { ...previous, pending: previous.pending + 1 }
    },
    { completed: 0, pending: 0 } as ChannelCounts
  )

  const channel = await getChannelById(channelId)
  await setChannelById(channelId, { ...channel, counts })

  return counts
}
