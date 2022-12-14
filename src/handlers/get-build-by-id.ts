import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build } from '../types'
import { getBuildById } from '../services/dynamodb'
import { log } from '../utils/logging'
import status from '../utils/status'

export const getBuildByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<Build>> => {
  log('Received event', { ...event, body: undefined })
  const buildId = event.pathParameters?.buildId as string
  const channelId = event.pathParameters?.channelId as string
  try {
    const result = await getBuildById(channelId, buildId)
    return { ...status.OK, body: JSON.stringify(result) }
  } catch (error) {
    return status.NOT_FOUND
  }
}
