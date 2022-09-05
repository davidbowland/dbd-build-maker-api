import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as twitch from '@services/twitch'
import { APIGatewayProxyEventV2, Channel, PatchOperation } from '@types'
import { channel, channelId, user } from '../__mocks__'
import eventJson from '@events/patch-item.json'
import { patchItemHandler } from '@handlers/patch-item'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/twitch')
jest.mock('@utils/events')
jest.mock('@utils/logging')

describe('patch-item', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2
  const expectedResult = { ...channel, notes: 'No Nurse' } as Channel

  beforeAll(() => {
    mocked(dynamodb).getChannelById.mockResolvedValue(channel)
    mocked(events).extractJsonPatchFromEvent.mockImplementation((event) => JSON.parse(event.body))
    mocked(twitch).getUserFromEvent.mockResolvedValue(user)
  })

  describe('patchItemHandler', () => {
    test('expect INTERNAL_SERVER_ERROR on getUserFromEvent reject', async () => {
      mocked(twitch).getUserFromEvent.mockRejectedValueOnce(undefined)
      const result = await patchItemHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect FORBIDDEN when getUserFromEvent returns undefined', async () => {
      mocked(twitch).getUserFromEvent.mockResolvedValueOnce(undefined)
      const result = await patchItemHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test("expect FORBIDDEN when user doesn't match channel", async () => {
      mocked(twitch).getUserFromEvent.mockResolvedValueOnce({ expiresIn: 93842, id: 'not-valid', name: 'whatever' })
      const result = await patchItemHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect BAD_REQUEST when unable to parse body', async () => {
      mocked(events).extractJsonPatchFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect BAD_REQUEST when patch operations are invalid', async () => {
      mocked(events).extractJsonPatchFromEvent.mockReturnValueOnce([
        { op: 'add', path: '/notes' },
      ] as unknown[] as PatchOperation[])
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test('expect BAD_REQUEST when extractJsonPatchFromEvent throws', async () => {
      mocked(events).extractJsonPatchFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining({ statusCode: status.BAD_REQUEST.statusCode }))
    })

    test("expect FORBIDDEN when patch operations don't match /notes or /disabledOptions", async () => {
      mocked(events).extractJsonPatchFromEvent.mockReturnValueOnce([
        { op: 'add', path: '/fnord' },
      ] as unknown[] as PatchOperation[])
      const result = await patchItemHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect OK when mod name matches channel', async () => {
      mocked(twitch).getUserFromEvent.mockResolvedValueOnce({ expiresIn: 93842, id: 'not-valid', name: 'mod1' })
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
    })

    test('expect NOT_FOUND on getChannelById reject', async () => {
      mocked(dynamodb).getChannelById.mockRejectedValueOnce(undefined)
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.NOT_FOUND))
    })

    test('expect INTERNAL_SERVER_ERROR on setChannelById reject', async () => {
      mocked(dynamodb).setChannelById.mockRejectedValueOnce(undefined)
      const result = await patchItemHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect setChannelById called with updated object', async () => {
      await patchItemHandler(event)
      expect(mocked(dynamodb).setChannelById).toHaveBeenCalledWith(channelId, expectedResult)
    })

    test('expect OK and body', async () => {
      const result = await patchItemHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual({ ...expectedResult, channelId })
    })
  })
})
