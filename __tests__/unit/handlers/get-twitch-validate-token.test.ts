import { mocked } from 'jest-mock'

import * as twitch from '@services/twitch'
import { APIGatewayProxyEventV2 } from '@types'
import eventJson from '@events/get-twitch-validate-token.json'
import { getTwitchValidateTokenHandler } from '@handlers/get-twitch-validate-token'
import status from '@utils/status'
import { user } from '../__mocks__'

jest.mock('@services/twitch')
jest.mock('@utils/logging')

describe('get-twitch-validate-token', () => {
  const event = eventJson as unknown as APIGatewayProxyEventV2

  beforeAll(() => {
    mocked(twitch).validateToken.mockResolvedValue(user)
  })

  describe('getTwitchValidateTokenHandler', () => {
    test('expect status of "valid" when token is valid', async () => {
      const result = await getTwitchValidateTokenHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual({
        id: '123456',
        name: 'btse',
        status: 'valid',
      })
    })

    test('expect status of "invalid" when token has expired or is invalid', async () => {
      mocked(twitch).validateToken.mockResolvedValueOnce(undefined)
      const result = await getTwitchValidateTokenHandler(event)
      expect(result).toEqual(expect.objectContaining(status.OK))
      expect(JSON.parse(result.body)).toEqual({
        status: 'invalid',
      })
    })

    test('expect INTERNAL_SERVER_ERROR when validateToken rejects', async () => {
      mocked(twitch).validateToken.mockRejectedValueOnce(undefined)
      const result = await getTwitchValidateTokenHandler(event)
      expect(result).toEqual(status.INTERNAL_SERVER_ERROR)
    })
  })
})
