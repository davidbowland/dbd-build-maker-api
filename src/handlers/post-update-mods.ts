import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build } from '../types'
import { getChannelById, setChannelById } from '../services/dynamodb'
import { getChannelMods, validateToken } from '../services/twitch'
import { log, logError } from '../utils/logging'
import { extractTokenFromEvent } from '../utils/events'
import status from '../utils/status'

const updateChannelMods = async (channelId: string, token: string): Promise<APIGatewayProxyResultV2<Build>> => {
  try {
    const channel = await getChannelById(channelId)
    try {
      const mods = await getChannelMods(channelId, token)
      await setChannelById(channelId, { ...channel, mods })
      return status.NO_CONTENT
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch {
    return status.NOT_FOUND
  }
}

export const postUpdateModsHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const channelId = event.pathParameters.channelId
    const token = extractTokenFromEvent(event)
    const user = await validateToken(token)
    if (user === undefined || channelId !== user.id) {
      return status.FORBIDDEN
    }
    return await updateChannelMods(channelId, token)
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
