import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import {
  deleteBuildById,
  deleteChannelById,
  deleteTokenById,
  scanChannels,
  scanExpiredBuildIds,
  scanExpiredTokens,
  updateChannelCounts,
} from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { channelExpireDuration } from '../config'
import status from '../utils/status'

export const postStartPruneHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const ids = await scanExpiredBuildIds()
    for (const build of ids) {
      await deleteBuildById(build.channelId, build.buildId)
    }
    const updatedChannels = new Set(ids.map((build) => build.channelId))
    for (const channelId of updatedChannels) {
      await updateChannelCounts(channelId, false)
    }

    const buildTokens = await scanExpiredTokens()
    for (const token of buildTokens) {
      await deleteTokenById(token.channelId, token.token)
    }

    const allChannels = await scanChannels()
    const currentTime = new Date().getTime()
    for (const channel of allChannels) {
      if (channel.data.lastModified + channelExpireDuration <= currentTime) {
        await deleteChannelById(channel.id)
      }
    }

    return status.NO_CONTENT
  } catch (error) {
    logError(error)
    return { ...status.INTERNAL_SERVER_ERROR }
  }
}
