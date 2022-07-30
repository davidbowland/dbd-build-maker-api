import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build } from '../types'
import { deleteTokenById, getTokenById, setBuildById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { extractBuildFromEvent } from '../utils/events'
import status from '../utils/status'

const confirmBuild = async (
  channelId: string,
  buildId: string,
  build: Build
): Promise<APIGatewayProxyResultV2<Build>> => {
  try {
    log('Setting build and deleting token', { build, buildId, channelId })
    await setBuildById(channelId, buildId, build)
    await deleteTokenById(channelId, buildId)
    return { ...status.OK, body: JSON.stringify(build) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const putBuildHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const channelId = event.pathParameters.channelId
  const buildId = event.pathParameters.buildId
  try {
    const token = await getTokenById(channelId, buildId)
    try {
      const build = { ...extractBuildFromEvent(event), submitter: token.submitter }
      return await confirmBuild(channelId, buildId, build)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch (error) {
    return status.FORBIDDEN
  }
}
