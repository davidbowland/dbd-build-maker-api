import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Channel } from '../types'
import { deleteChannelById, getChannelById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { extractTokenFromEvent } from '../utils/events'
import status from '../utils/status'
import { validateToken } from '../services/twitch'

const fetchDataThenDelete = async (channelId: string): Promise<APIGatewayProxyResultV2<Channel>> => {
  try {
    const data = await getChannelById(channelId)
    log('Deleted channel', { channelId, data })
    try {
      await deleteChannelById(channelId)
      return { ...status.OK, body: JSON.stringify(data) }
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    return status.NO_CONTENT
  }
}

export const deleteByIdHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<Channel>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const channelId = event.pathParameters.channelId
    const user = await validateToken(extractTokenFromEvent(event))
    if (user === undefined || user.id !== channelId) {
      return status.FORBIDDEN
    }
    return await fetchDataThenDelete(channelId)
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
