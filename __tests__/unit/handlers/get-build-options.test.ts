import { mocked } from 'jest-mock'

import * as buildOptions from '@utils/build-options'
import { APIGatewayProxyEventV2 } from '@types'
import buildOptionsObject from '@assets/build-options-chapter-27'
import eventJson from '@events/get-build-by-id.json'
import { getBuildOptionsHandler } from '@handlers/get-build-options'
import status from '@utils/status'

jest.mock('@utils/build-options')
jest.mock('@utils/logging')

describe('get-build-options', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(buildOptions).getActiveBuildOptions.mockResolvedValue(buildOptionsObject)
  })

  describe('getBuildOptionsHandler', () => {
    test('expect endpoint returns build options', async () => {
      const result = await getBuildOptionsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual(buildOptionsObject)
    })

    test('expect INTERNAL_SERVER_ERROR when getActiveBuildOptions rejects', async () => {
      mocked(buildOptions).getActiveBuildOptions.mockRejectedValueOnce(undefined)

      const result = await getBuildOptionsHandler(event)
      expect(result).toEqual(expect.objectContaining(status.INTERNAL_SERVER_ERROR))
    })
  })
})
