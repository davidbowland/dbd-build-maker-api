import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, ChannelBatch } from '../types'
import { log, logError } from '../utils/logging'
import { queryBuildsByChannelId } from '../services/dynamodb'
import status from '../utils/status'

export const getAllBuildsHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<ChannelBatch[]>> => {
  log('Received event', event)
  try {
    const channelId = event.pathParameters?.channelId as string
    const data = await queryBuildsByChannelId(channelId)
    return { ...status.OK, body: JSON.stringify(data) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
