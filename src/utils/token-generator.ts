import { getBuildById, getTokenById } from '../services/dynamodb'
import { tokenExpireHours, tokenMaxLength, tokenMinLength } from '../config'
import { Token } from '../types'

// 60 minutes * 60 seconds * 1000 milliseconds = 3_600_000
const TOKEN_EXPIRATION_DURATION = tokenExpireHours * 3_600_000

// Don't allow vowels, digits that look like vowels, or ambiguous characters
const allowedCharacters = '256789bcdfghjmnpqrstvwxz'

const valueToId = (value: number): string => {
  const digit = allowedCharacters.charAt(value % allowedCharacters.length)
  return value >= allowedCharacters.length ? valueToId(Math.floor(value / allowedCharacters.length)) + digit : digit
}

const tokenExists = async (channelId: string, token: string): Promise<boolean> => {
  try {
    await getTokenById(channelId, token)
    return true
  } catch (error) {
    try {
      await getBuildById(channelId, token)
      return true
    } catch (error) {
      return false
    }
  }
}

const getRandomToken = async (channelId: string, minValue: number, maxValue: number): Promise<string> => {
  const randomValue = Math.round(Math.random() * (maxValue - minValue) + minValue)
  const token = valueToId(randomValue)
  if (await tokenExists(channelId, token)) {
    return getRandomToken(channelId, minValue, maxValue)
  }
  return token
}

export const getNextToken = async (channelId: string): Promise<Token> => {
  const minValue = Math.pow(allowedCharacters.length, tokenMinLength - 1)
  const maxValue = Math.pow(allowedCharacters.length, tokenMaxLength)
  return {
    expiration: new Date().getTime() + TOKEN_EXPIRATION_DURATION,
    value: await getRandomToken(channelId, minValue, maxValue),
  }
}
