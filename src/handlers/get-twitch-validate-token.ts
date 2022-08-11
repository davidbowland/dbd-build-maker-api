import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, TwitchTokenStatus, User } from '../types'
import { log, logError } from '../utils/logging'
import { extractTokenFromEvent } from '../utils/events'
import status from '../utils/status'
import { validateToken } from '../services/twitch'

const generateResult = (user: User): TwitchTokenStatus => {
  if (user === undefined) {
    return {
      status: 'invalid',
    }
  }
  return {
    id: user.id,
    name: user.name,
    status: 'valid',
  }
}

export const getTwitchValidateTokenHandler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const token = extractTokenFromEvent(event)
    const user = await validateToken(token)
    log({ token, user })
    const result = generateResult(user)
    return { ...status.OK, body: JSON.stringify(result) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
