import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { getChannelById, setTokenById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { Token } from '../types'
import { extractSubmitterFromEvent } from '../utils/events'
import { getNextToken } from '../utils/token-generator'
import { getUserFromEvent } from '../services/twitch'
import status from '../utils/status'

const createNewToken = async (channelId: string, submitter): Promise<APIGatewayProxyResultV2<Token>> => {
  const buildToken = await getNextToken(channelId)

  log('Creating token', { buildToken, channelId })
  await setTokenById(channelId, buildToken.value, buildToken.expiration, submitter)

  return {
    ...status.CREATED,
    body: JSON.stringify(buildToken),
  }
}

export const postTokenHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const channelId = event.pathParameters.channelId
    const submitter = extractSubmitterFromEvent(event)
    try {
      const channel = await getChannelById(channelId)
      const user = await getUserFromEvent(event)

      log({ channelId, submitter, user })
      if (user === undefined || (user.id !== channelId && channel.mods.every((m) => m.user_id !== user.id))) {
        return status.FORBIDDEN
      }

      return await createNewToken(channelId, submitter)
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
  }
}
