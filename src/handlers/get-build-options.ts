import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from '../types'
import buildOptions from '../assets/build-options.json'
import { log } from '../utils/logging'
import status from '../utils/status'

export const getBuildOptionsHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2<any>> => {
  log('Received event', { ...event, body: undefined })
  return { ...status.OK, body: JSON.stringify(buildOptions) }
}

/*
Scrape code for generating build options:
Array.from(temp0.querySelectorAll('tr')).map((el) => el.querySelector('th ~ th').innerText).join(',')
Array.from(document.querySelectorAll('section > p')).map((el) => el.innerText).join(',')
*/
