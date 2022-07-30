import { APIGatewayProxyEventV2 } from '@types'
import buildOptions from '@assets/build-options.json'
import eventJson from '@events/get-build-by-id.json'
import { getBuildOptionsHandler } from '@handlers/get-build-options'
import status from '@utils/status'

jest.mock('@utils/logging')

describe('get-build-options', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  describe('getBuildOptionsHandler', () => {
    test('expect endpoint returns build options', async () => {
      const result = await getBuildOptionsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual(buildOptions)
    })
  })
})
