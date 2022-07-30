import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { extractSubmitterFromEvent, extractTokenFromEvent } from '../utils/events'
import { log, logError } from '../utils/logging'
import { Token } from '../types'
import { getNextToken } from '../utils/token-generator'
import { setTokenById } from '../services/dynamodb'
import status from '../utils/status'
import { validateToken } from '../services/twitch'

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
    const token = extractTokenFromEvent(event)
    try {
      const user = await validateToken(token)
      if (user === undefined || user.id !== channelId) {
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
