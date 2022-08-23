import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import * as events from '@utils/events'
import * as tokenGenerator from '@utils/token-generator'
import * as twitch from '@services/twitch'
import { buildToken, channel, channelId, submitter, twitchAuthToken, user } from '../__mocks__'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/post-token.json'
import { postTokenHandler } from '@handlers/post-token'
import status from '@utils/status'

jest.mock('@services/dynamodb')
jest.mock('@services/twitch')
jest.mock('@utils/events')
jest.mock('@utils/logging')
jest.mock('@utils/token-generator')

describe('post-token', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(dynamodb).getChannelById.mockResolvedValue(channel)
    mocked(events).extractSubmitterFromEvent.mockReturnValue(submitter)
    mocked(events).extractTokenFromEvent.mockReturnValue(twitchAuthToken)
    mocked(tokenGenerator).getNextToken.mockResolvedValue(buildToken)
    mocked(twitch).validateToken.mockResolvedValue(user)
  })

  describe('postTokenHandler', () => {
    test('expect BAD_REQUEST when extract submitter fails', async () => {
      mocked(events).extractSubmitterFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await postTokenHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
    })

    test('expect BAD_REQUEST when extract token fails', async () => {
      mocked(events).extractTokenFromEvent.mockImplementationOnce(() => {
        throw new Error('Bad request')
      })
      const result = await postTokenHandler(event)
      expect(result).toEqual(expect.objectContaining(status.BAD_REQUEST))
    })

    test('expect INTERNAL_SERVER_ERROR on validateToken reject', async () => {
      mocked(twitch).validateToken.mockRejectedValueOnce(undefined)
      const result = await postTokenHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test("expect FORBIDDEN on when token doesn't match channel", async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce({ expiresIn: 234242, id: 'not-valid', name: 'whatever' })
      const result = await postTokenHandler(event)
      expect(result).toEqual(status.FORBIDDEN)
    })

    test('expect CREATED when user is mod of channel', async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce({ expiresIn: 93495, id: 'not-valid', name: 'mod1' })
      const result = await postTokenHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
    })

    test('expect channel passed to setTokenById', async () => {
      await postTokenHandler(event)
      expect(mocked(dynamodb).setTokenById).toHaveBeenCalledWith(
        channelId,
        buildToken.value,
        buildToken.expiration,
        submitter
      )
    })

    test('expect INTERNAL_SERVER_ERROR on setTokenById reject', async () => {
      mocked(dynamodb).setTokenById.mockRejectedValueOnce(undefined)
      const result = await postTokenHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })

    test('expect CREATED and body', async () => {
      const result = await postTokenHandler(event)
      expect(result).toEqual(expect.objectContaining(status.CREATED))
      expect(JSON.parse(result.body)).toEqual(buildToken)
    })
  })
})
