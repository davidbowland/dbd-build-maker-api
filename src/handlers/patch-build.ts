import { applyPatch } from 'fast-json-patch'

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Build, PatchOperation } from '../types'
import { extractJsonPatchFromEvent, extractTokenFromEvent } from '../utils/events'
import { getBuildById, setBuildById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { mutateObjectOnJsonPatch, throwOnInvalidJsonPatch } from '../config'
import status from '../utils/status'
import { validateToken } from '../services/twitch'

const applyJsonPatch = async (
  build: Build,
  channelId: string,
  buildId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<Build>> => {
  const updatedBuild = applyPatch(build, patchOperations, throwOnInvalidJsonPatch, mutateObjectOnJsonPatch).newDocument
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
  patchOperations: PatchOperation[],
  subject?: string
): Promise<APIGatewayProxyResultV2<Build>> => {
  try {
    if (subject && channelId !== subject) {
      return status.FORBIDDEN
    } else if (subject && !patchOperations.every((value) => value.path === '/completed')) {
      return status.FORBIDDEN
    }

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
    const user = await validateToken(extractTokenFromEvent(event))
    try {
      const patchOperations = extractJsonPatchFromEvent(event)
      const result = await patchById(channelId, buildId, patchOperations, user.id)
      return result
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
