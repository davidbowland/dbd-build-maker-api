import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Channel } from '../types'
import { getChannelById } from '../services/dynamodb'
import { log } from '../utils/logging'
import status from '../utils/status'

const fetchById = async (channelId: string): Promise<APIGatewayProxyResultV2<Channel>> => {
  try {
    const data = await getChannelById(channelId)
    return { ...status.OK, body: JSON.stringify({ ...data, channelId }) }
  } catch (error) {
    return status.NOT_FOUND
  }
}

export const getByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<Channel>> => {
  log('Received event', { ...event, body: undefined })
  const channelId = event.pathParameters.channelId
  return await fetchById(channelId)
}
