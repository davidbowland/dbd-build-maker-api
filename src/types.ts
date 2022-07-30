export * from 'aws-lambda'
export { Operation as PatchOperation } from 'fast-json-patch'

export interface Build {
  addon1: string
  addon2: string
  character: string
  completed?: number
  expiration: number
  item?: string
  notes?: string
  offering: string
  perk1: string
  perk2: string
  perk3: string
  perk4: string
  submitter?: string
}

export interface BuildBatch {
  channelId: string
  data: Build
  id: string
}

export interface Channel {
  mods: string[]
  name: string
  pic: string
}

export interface ChannelBatch {
  data: Channel
  id: string
}

export interface StringObject {
  [key: string]: any
}

export interface Token {
  expiration: number
  value: string
}

export interface TwitchTokenStatus {
  name?: string
  status: 'valid' | 'invalid'
}

export interface User {
  id: string
  name: string
}
