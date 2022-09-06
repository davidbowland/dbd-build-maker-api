import { applyPatch } from 'fast-json-patch'

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build, PatchOperation } from '../types'
import {
  buildCompletedExpireDuration,
  buildUncompletedExpireDuration,
  mutateObjectOnJsonPatch,
  throwOnInvalidJsonPatch,
} from '../config'
import { getBuildById, getChannelById, setBuildById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { extractJsonPatchFromEvent } from '../utils/events'
import { getUserFromEvent } from '../services/twitch'
import status from '../utils/status'

const applyJsonPatch = async (
  build: Build,
  channelId: string,
  buildId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<Build>> => {
  const patchedBuild = applyPatch(build, patchOperations, throwOnInvalidJsonPatch, mutateObjectOnJsonPatch).newDocument
  const expirationDuration = patchedBuild.completed ? buildCompletedExpireDuration : buildUncompletedExpireDuration
  const updatedBuild = { ...patchedBuild, expiration: new Date().getTime() + expirationDuration }
  try {
    await setBuildById(channelId, buildId, updatedBuild)
    return { ...status.OK, body: JSON.stringify({ ...updatedBuild, buildId, channelId }) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

const patchById = async (
  channelId: string,
  buildId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<Build>> => {
  try {
    const build = await getBuildById(channelId, buildId)
    try {
      return await applyJsonPatch(build, channelId, buildId, patchOperations)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch {
    return status.NOT_FOUND
  }
}

export const patchBuildHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const buildId = event.pathParameters.buildId
    const channelId = event.pathParameters.channelId
    const channel = await getChannelById(channelId)
    const user = await getUserFromEvent(event)
    try {
      const patchOperations = extractJsonPatchFromEvent(event)
      if (user === undefined || (channelId !== user.id && channel.mods.indexOf(user.name) < 0)) {
        return status.FORBIDDEN
      } else if (!patchOperations.every((value) => value.path === '/completed')) {
        return status.FORBIDDEN
      }
      log({ buildId, channelId, patchOperations, user })
      return await patchById(channelId, buildId, patchOperations)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
