import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build } from '../types'
import { deleteTokenById, getChannelById, getTokenById, setBuildById, updateChannelCounts } from '../services/dynamodb'
import { extractRequestError, log, logError } from '../utils/logging'
import { extractBuildFromEvent } from '../utils/events'
import status from '../utils/status'

const confirmBuild = async (
  channelId: string,
  buildId: string,
  build: Build,
): Promise<APIGatewayProxyResultV2<Build>> => {
  try {
    log('Setting build and deleting token', { build, buildId, channelId })
    await setBuildById(channelId, buildId, build)
    await deleteTokenById(channelId, buildId)
    await updateChannelCounts(channelId)
    return { ...status.OK, body: JSON.stringify(build) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

export const putBuildHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  const buildId = event.pathParameters?.buildId as string
  const channelId = event.pathParameters?.channelId as string
  try {
    const token = await getTokenById(channelId, buildId)
    try {
      const channel = await getChannelById(channelId)
      try {
        const eventBuild = await extractBuildFromEvent(event, channel.disabledOptions)
        const build = { ...eventBuild, submitter: token.submitter }
        return await confirmBuild(channelId, buildId, build)
      } catch (error: any) {
        return { ...status.BAD_REQUEST, body: JSON.stringify(extractRequestError(error.message)) }
      }
    } catch (error) {
      logError(error)
      return status.INTERNAL_SERVER_ERROR
    }
  } catch (error) {
    logError(error)
    return status.FORBIDDEN
  }
}
