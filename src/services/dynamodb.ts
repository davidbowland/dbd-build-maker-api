import {
  DeleteItemCommand,
  DeleteItemOutput,
  DynamoDB,
  GetItemCommand,
  PutItemCommand,
  PutItemOutput,
  QueryCommand,
  ScanCommand,
  ScanOutput,
} from '@aws-sdk/client-dynamodb'

import { Build, BuildBatch, Channel, ChannelBatch, ChannelCounts } from '../types'
import { dynamodbBuildTableName, dynamodbChannelTableName, dynamodbTokenTableName } from '../config'
import { xrayCapture } from '../utils/logging'

const dynamodb = xrayCapture(new DynamoDB({ apiVersion: '2012-08-10' }))

/* Delete item */

export const deleteBuildById = async (channelId: string, buildId: string): Promise<DeleteItemOutput> => {
  const command = new DeleteItemCommand({
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
  return dynamodb.send(command)
}

export const deleteChannelById = async (channelId: string): Promise<DeleteItemOutput> => {
  const command = new DeleteItemCommand({
    Key: {
      ChannelId: {
        S: `${channelId}`,
      },
    },
    TableName: dynamodbChannelTableName,
  })
  return dynamodb.send(command)
}

export const deleteTokenById = async (channelId: string, token: string): Promise<DeleteItemOutput> => {
  const command = new DeleteItemCommand({
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
  return dynamodb.send(command)
}

/* Get single item */

export const getBuildById = async (channelId: string, buildId: string): Promise<Build> => {
  const command = new GetItemCommand({
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
  const response = await dynamodb.send(command)
  return JSON.parse(response.Item.Data.S as string)
}

export const getChannelById = async (channelId: string): Promise<Channel> => {
  const command = new GetItemCommand({
    Key: {
      ChannelId: {
        S: `${channelId}`,
      },
    },
    TableName: dynamodbChannelTableName,
  })
  const response = await dynamodb.send(command)
  return JSON.parse(response.Item.Data.S as string)
}

export const getTokenById = async (channelId: string, token: string): Promise<{ submitter: string }> => {
  const command = new GetItemCommand({
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
  const response = await dynamodb.send(command)
  return { submitter: response.Item.Submitter.S }
}

/* Query builds by channel */

const getItemsFromBuildQuery = (response: ScanOutput): BuildBatch[] =>
  response.Items?.map((item) => ({
    channelId: item.ChannelId.S as string,
    data: JSON.parse(item.Data.S as string),
    id: item.BuildId.S as string,
  })) as BuildBatch[]

export const queryBuildsByChannelId = async (channelId: string): Promise<BuildBatch[]> => {
  const command = new QueryCommand({
    ExpressionAttributeValues: {
      ':v1': {
        S: channelId,
      },
    },
    KeyConditionExpression: 'ChannelId = :v1',
    TableName: dynamodbBuildTableName,
  })
  const response = await dynamodb.send(command)
  return getItemsFromBuildQuery(response)
}

/* Scan for all items */

const getChannelsFromScan = (response: ScanOutput): ChannelBatch[] =>
  response.Items?.map((item) => ({
    data: JSON.parse(item.Data.S as string),
    id: item.ChannelId.S as string,
  })) as ChannelBatch[]

export const scanChannels = async (): Promise<ChannelBatch[]> => {
  const command = new ScanCommand({
    AttributesToGet: ['ChannelId', 'Data'],
    TableName: dynamodbChannelTableName,
  })
  const response = await dynamodb.send(command)
  return getChannelsFromScan(response)
}

/* Scan for expired items */

export const scanExpiredBuildIds = async (): Promise<{ buildId: string; channelId: string }[]> => {
  const command = new ScanCommand({
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
  const response = await dynamodb.send(command)
  return response.Items.map((item: any) => ({ buildId: item.BuildId.S, channelId: item.ChannelId.S }))
}

export const scanExpiredTokens = async (): Promise<{ channelId: string; token: string }[]> => {
  const command = new ScanCommand({
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
  const response = await dynamodb.send(command)
  return response.Items.map((item: any) => ({ channelId: item.ChannelId.S, token: item.Token.S }))
}

/* Set item */

export const setBuildById = async (channelId: string, buildId: string, data: Build): Promise<PutItemOutput> => {
  const command = new PutItemCommand({
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
  return dynamodb.send(command)
}

export const setChannelById = async (channelId: string, data: Channel): Promise<PutItemOutput> => {
  const command = new PutItemCommand({
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
  return dynamodb.send(command)
}

export const setTokenById = async (
  channelId: string,
  token: string,
  expiration: number,
  submitter: string,
): Promise<PutItemOutput> => {
  const command = new PutItemCommand({
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
  return dynamodb.send(command)
}

/* Update counts */

export const updateChannelCounts = async (channelId: string, updateLastModified = true): Promise<ChannelCounts> => {
  const builds = await queryBuildsByChannelId(channelId)
  const counts = builds.reduce(
    (previous, current) => {
      if (current.data.completed) {
        return { ...previous, completed: previous.completed + 1 }
      }
      return { ...previous, pending: previous.pending + 1 }
    },
    { completed: 0, pending: 0 } as ChannelCounts,
  )

  const channel = await getChannelById(channelId)
  await setChannelById(channelId, {
    ...channel,
    counts,
    lastModified: updateLastModified ? new Date().getTime() : channel.lastModified,
  })

  return counts
}
