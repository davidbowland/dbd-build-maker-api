import { applyPatch } from 'fast-json-patch'

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Channel, PatchOperation, User } from '../types'
import { getChannelById, setChannelById } from '../services/dynamodb'
import { log, logError } from '../utils/logging'
import { mutateObjectOnJsonPatch, throwOnInvalidJsonPatch } from '../config'
import { extractJsonPatchFromEvent } from '../utils/events'
import { getUserFromEvent } from '../services/twitch'
import status from '../utils/status'

const applyJsonPatch = async (
  channel: Channel,
  channelId: string,
  patchOperations: PatchOperation[]
): Promise<APIGatewayProxyResultV2<Channel>> => {
  const updatedChannel = applyPatch(
    channel,
    patchOperations,
    throwOnInvalidJsonPatch,
    mutateObjectOnJsonPatch
  ).newDocument
  try {
    await setChannelById(channelId, updatedChannel)
    return { ...status.OK, body: JSON.stringify({ ...updatedChannel, channelId }) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}

const patchById = async (
  channelId: string,
  patchOperations: PatchOperation[],
  user?: User
): Promise<APIGatewayProxyResultV2<Channel>> => {
  try {
    const channel = await getChannelById(channelId)
    if (user === undefined || (user.id !== channelId && channel.mods.every((m) => m.user_id !== user.id))) {
      return status.FORBIDDEN
    }
    try {
      return await applyJsonPatch(channel, channelId, patchOperations)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch {
    return status.NOT_FOUND
  }
}

export const patchItemHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  try {
    const channelId = event.pathParameters.channelId
    const user = await getUserFromEvent(event)

    try {
      const patchOperations = extractJsonPatchFromEvent(event)
      if (!patchOperations.every((value) => value.path === '/notes' || value.path.startsWith('/disabledOptions/'))) {
        return status.FORBIDDEN
      }
      log({ channelId, patchOperations, user })

      return await patchById(channelId, patchOperations, user)
    } catch (error) {
      return { ...status.BAD_REQUEST, body: JSON.stringify({ message: error.message }) }
    }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
