import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import { log, logError } from '../utils/logging'
import { getActiveBuildOptions } from '../utils/build-options'
import status from '../utils/status'

export const getBuildOptionsHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })

  try {
    const buildOptions = await getActiveBuildOptions()
    return { ...status.OK, body: JSON.stringify(buildOptions) }
  } catch (error) {
    logError(error)
    return status.INTERNAL_SERVER_ERROR
  }
}
