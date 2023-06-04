import { mocked } from 'jest-mock'

import * as dynamodb from '@services/dynamodb'
import { buildKiller, channelId, submitter } from '../__mocks__'
import { getNextToken } from '@utils/token-generator'

jest.mock('@services/dynamodb')

describe('id-generator', () => {
  const mockRandom = jest.fn()

  beforeAll(() => {
    Math.random = mockRandom.mockReturnValue(0.5)
  })

  describe('getNextId', () => {
    beforeAll(() => {
      mocked(dynamodb).getBuildById.mockRejectedValue(undefined)
      mocked(dynamodb).getTokenById.mockRejectedValue(undefined)
    })

    test('expect id returned passed to setDataById', async () => {
      const result = await getNextToken(channelId)
      expect(result).toEqual(expect.objectContaining({ value: 'j2j2' }))
      expect(result.expiration).toBeDefined()
    })

    test('expect second sessionId when first exists in token table', async () => {
      mocked(dynamodb).getTokenById.mockResolvedValueOnce({ submitter })
      mockRandom.mockReturnValueOnce(0.5)
      mockRandom.mockReturnValueOnce(0.25)

      const result = await getNextToken(channelId)
      expect(result).toEqual(expect.objectContaining({ value: 'b2s2' }))
      expect(result.expiration).toBeDefined()
    })

    test('expect second sessionId when first exists in build table', async () => {
      mocked(dynamodb).getBuildById.mockResolvedValueOnce(buildKiller)
      mockRandom.mockReturnValueOnce(0.5)
      mockRandom.mockReturnValueOnce(0.25)

      const result = await getNextToken(channelId)
      expect(result).toEqual(expect.objectContaining({ value: 'b2s2' }))
      expect(result.expiration).toBeDefined()
    })
  })
})
