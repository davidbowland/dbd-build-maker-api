import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Channel } from '../types'
import { getChannelInfo, getChannelMods, validateToken } from '../services/twitch'
import { log, logError } from '../utils/logging'
import { extractTokenFromEvent } from '../utils/events'
import { setChannelById } from '../services/dynamodb'
import status from '../utils/status'

const createNewChannel = async (channelId: string, token: string): Promise<APIGatewayProxyResultV2<Channel>> => {
  const channelInfo = await getChannelInfo(channelId, token)
  const mods = await getChannelMods(channelId, token)
  const channel = { ...channelInfo, disabledOptions: [], mods }

  log('Creating channel', { channel, channelId })
  await setChannelById(channelId, channel)

  return {
    ...status.CREATED,
    body: JSON.stringify({ ...channel, channelId }),
  }
}

export const postItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const token = extractTokenFromEvent(event)
    try {
      const user = await validateToken(token)
      if (user === undefined) {
        return status.FORBIDDEN
      }
      return await createNewChannel(user.id, token)
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
