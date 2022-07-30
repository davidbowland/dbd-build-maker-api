import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build } from '../types'
import { getTokenById } from '../services/dynamodb'
import { log } from '../utils/logging'
import status from '../utils/status'

export const getTokenByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<Build>> => {
  log('Received event', { ...event, body: undefined })
  const channelId = event.pathParameters.channelId
  const token = event.pathParameters.token
  try {
    const result = await getTokenById(channelId, token)
    return { ...status.OK, body: JSON.stringify(result) }
  } catch (error) {
    return status.NOT_FOUND
  }
}
