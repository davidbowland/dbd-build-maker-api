import { Build, BuildBatch, Channel, ChannelBatch, PatchOperation, Token, User } from '@types'

export const buildId = 'ytrfghjklkmnbvfty'

export const buildKiller: Build = {
  addon1: 'Bone Clapper',
  addon2: 'None',
  character: 'Wraith',
  expiration: 1659106766021,
  offering: 'Ebony Memento Mori',
  perk1: 'Dark Devotion',
  perk2: 'Eruption',
  perk3: 'Oppression',
  perk4: 'None',
}

export const buildSurvivor: Build = {
  addon1: 'Broken Bulb',
  addon2: 'None',
  character: 'Jill Valentine',
  completed: 1661234676238,
  expiration: 1659106766021,
  item: 'Flashlight',
  offering: 'Fragrant Sweet William',
  perk1: 'Buckle Up',
  perk2: 'Rookie Spirit',
  perk3: 'Technician',
  perk4: 'None',
}

export const buildToken: Token = {
  expiration: 1659106766021,
  value: 'ytrfghjklkmnbvfty',
}

export const channelId = '123456'

export const channelInfo = {
  name: 'MyChannel',
  notes: 'No new perks',
  pic: 'https://twitch.com/logo.png',
}

export const mods = ['mod1', 'mod2']

export const channel: Channel = {
  ...channelInfo,
  disabledOptions: [],
  mods,
}

export const jsonPatchOperations: PatchOperation[] = [{ op: 'replace', path: '/notes', value: 'No Nurse' }]

export const submitter = 'cfb'

export const twitchAuthResponse = {
  client_id: 'kvm5x4qwemvofwhdtm7zipljyylnpf',
  expires_in: 5543954,
  login: 'btse',
  scopes: ['moderation:read'],
  user_id: '269300532',
}

export const twitchAuthToken = 'ytfghjklkgtyuijnmk'

export const userId = channelId

export const user: User = {
  expiresIn: 5543954,
  id: userId,
  name: 'btse',
}

/* Batches */

export const buildBatch: BuildBatch[] = [{ channelId, data: buildKiller, id: buildId }]

export const channelBatch: ChannelBatch[] = [{ data: channel, id: channelId }]
