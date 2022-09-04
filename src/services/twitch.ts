import { APIGatewayProxyEventV2, User } from '../types'
import { log, xrayCaptureHttps } from '../utils/logging'
import axios from 'axios'
import { extractTokenFromEvent } from '../utils/events'
import { twitchClientId } from '../config'

xrayCaptureHttps()
const api = axios.create({
  baseURL: 'https://api.twitch.tv',
})

const auth = axios.create({
  baseURL: 'https://id.twitch.tv',
})

const MOD_FETCH_COUNT = 100

/* Twitch API */

// https://dev.twitch.tv/docs/api/reference#get-moderators
export const getChannelMods = (channelId: string, token: string, pagination?: any): Promise<string[]> =>
  api
    .get('/helix/moderation/moderators', {
      headers: { Authorization: `Bearer ${token}`, 'Client-ID': twitchClientId },
      params: { after: pagination, broadcaster_id: channelId, first: MOD_FETCH_COUNT },
    })
    .then(async (response) => {
      log('Twitch getChannelMods response', response.data)
      if (Object.keys(response.data.pagination).length === 0) {
        return response.data.data as unknown as string[]
      }
      const nextMods = await getChannelMods(channelId, token, response.data.pagination)
      return [...response.data.data, ...nextMods]
    })

// https://dev.twitch.tv/docs/api/reference#get-users
export const getChannelInfo = (channelId: string, token: string): Promise<{ name: string; pic: string }> =>
  api
    .get('/helix/users', {
      headers: { Authorization: `Bearer ${token}`, 'Client-ID': twitchClientId },
      params: { id: channelId },
    })
    .then((response) => ({
      name: response.data.data[0].display_name,
      pic: response.data.data[0].profile_image_url || response.data.data[0].offline_image_url,
    }))

// https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=kvm5x4qwemvofwhdtm7zipljyylnpf&redirect_uri=https://dbowland.com/&scope=moderation%3Aread
// https://dev.twitch.tv/docs/authentication/validate-tokens#how-to-validate-a-token
export const validateToken = (token: string): Promise<User | undefined> =>
  auth
    .get('/oauth2/validate', { headers: { Authorization: `OAuth ${token}` } })
    .then((response) => {
      log('Twitch validateToken response', response.data)
      return {
        expiresIn: response.data.expires_in,
        id: response.data.user_id,
        name: response.data.login,
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        return undefined
      }
      throw error
    })

/* Helper functions */

export const getUserFromEvent = async (event: APIGatewayProxyEventV2): Promise<User | undefined> => {
  if (event.requestContext?.domainPrefix === 'dbd-build-maker-api-internal') {
    return {
      expiresIn: 10_000,
      id: event.headers['x-twitch-id'],
      name: event.headers['x-twitch-name'],
    } as User
  } else {
    return await validateToken(extractTokenFromEvent(event))
  }
}
