import axios from 'axios'
import axiosRetry from 'axios-retry'

// Axios

axiosRetry(axios, { retries: 3 })

// Builds

// 60 minutes * 60 seconds * 1000 milliseconds = 3_600_000
export const buildCompletedExpireDuration = parseInt(process.env.BUILD_COMPLETED_EXPIRE_HOURS as string, 10) * 3_600_000
// 24 hours * 60 minutes * 60 seconds * 1000 milliseconds = 86_400_000
export const buildUncompletedExpireDuration =
  parseInt(process.env.BUILD_UNCOMPLETED_EXPIRE_DAYS as string, 10) * 86_400_000

// DynamoDB

export const dynamodbBuildTableName = process.env.DYNAMODB_BUILD_TABLE_NAME as string
export const dynamodbChannelTableName = process.env.DYNAMODB_CHANNEL_TABLE_NAME as string
export const dynamodbTokenTableName = process.env.DYNAMODB_TOKEN_TABLE_NAME as string

// JsonPatch

export const mutateObjectOnJsonPatch = false
export const throwOnInvalidJsonPatch = true

// Tokens

export const tokenExpireHours = parseInt(process.env.TOKEN_EXPIRE_HOURS as string, 10)
export const tokenMinLength = parseInt(process.env.TOKEN_MIN_LENGTH as string, 10)
export const tokenMaxLength = parseInt(process.env.TOKEN_MAX_LENGTH as string, 10)

// Twitch

export const twitchClientId = process.env.TWITCH_CLIENT_ID
