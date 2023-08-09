import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, TwitchTokenStatus, User } from '../types'
import { log, logError } from '../utils/logging'
import { getUserFromEvent } from '../services/twitch'
import status from '../utils/status'

const generateResult = (user?: User): TwitchTokenStatus => {
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
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const user = await getUserFromEvent(event)
    const result = generateResult(user)
    log({ result })
    return { ...status.OK, body: JSON.stringify(result) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
