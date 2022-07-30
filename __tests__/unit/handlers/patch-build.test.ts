import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as twitch from '@services/twitch'
import { APIGatewayProxyEventV2, Build, PatchOperation } from '@types'
import { buildId, buildKiller, channelId, user } from '../__mocks__'
import eventJson from '@events/patch-build.json'
import { patchBuildHandler } from '@handlers/patch-build'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/twitch')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('patch-build', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2
  const expectedResult = { ...buildKiller, completed: 1659149502165 } as Build

  beforeAll(() => {
    mocked(dynamodb).getBuildById.mockResolvedValue(buildKiller)
    mocked(events).extractJsonPatchFromEvent.mockImplementation((event) => JSON.parse(event.body))
    mocked(twitch).validateToken.mockResolvedValue(user)
  })

  describe('patchBuildHandler', () => {
    test('expect BAD_REQUEST when unable to parse body', async () => {
      mocked(events).extractJsonPatchFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await patchBuildHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect BAD_REQUEST when patch operations are invalid', async () => {
      mocked(events).extractJsonPatchFromEvent.mockReturnValueOnce([
        { op: 'replace', path: '/completed' },
      ] as unknown[] as PatchOperation[])
      const result = await patchBuildHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect BAD_REQUEST when extractJsonPatchFromEvent throws', async () => {
      mocked(events).extractJsonPatchFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await patchBuildHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect INTERNAL_SERVER_ERROR on validateToken reject', async () => {
      mocked(twitch).validateToken.mockRejectedValueOnce(undefined)
      const result = await patchBuildHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test("expect FORBIDDEN when token doesn't match channel", async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce({ id: 'not-valid', name: 'whatever' })
      const result = await patchBuildHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect FORBIDDEN when path is not mutable', async () => {
      mocked(events).extractJsonPatchFromEvent.mockReturnValueOnce([
        { op: 'replace', path: '/character', value: 'Nea' },
      ] as unknown[] as PatchOperation[])
      const result = await patchBuildHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect NOT_FOUND on getBuildById reject', async () => {
      mocked(dynamodb).getBuildById.mockRejectedValueOnce(undefined)
      const result = await patchBuildHandler(event)
      expect(result).toEqual(expect.objectContaining(status.NOT_FOUND))
    })

    test('expect INTERNAL_SERVER_ERROR on setBuildById reject', async () => {
      mocked(dynamodb).setBuildById.mockRejectedValueOnce(undefined)
      const result = await patchBuildHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect setBuildById called with updated object', async () => {
      await patchBuildHandler(event)
      expect(mocked(dynamodb).setBuildById).toHaveBeenCalledWith(channelId, buildId, expectedResult)
    })

    test('expect OK and body', async () => {
      const result = await patchBuildHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual({ ...expectedResult, buildId, channelId })
    })
  })
})
