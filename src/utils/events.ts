import { APIGatewayProxyEventV2, Build, PatchOperation } from '../types'
import { buildExpireHours } from '../config'
import buildOptions from '../assets/build-options.json'

// 60 minutes * 60 seconds * 1000 milliseconds = 3_600_000
const BUILD_EXPIRATION_DURATION = buildExpireHours * 3_600_000

/* DBD Build Maker */

export const formatBuild = (build: Build): Build => {
  const isKiller = Object.keys(buildOptions.Killers).indexOf(build.character) >= 0
  if (!isKiller && buildOptions.Survivors.indexOf(build.character) < 0) {
    throw new Error('"character" has an invalid value')
  }
  if (isKiller) {
    const killer = buildOptions.Killers[build.character]
    if (killer.indexOf(build.addon1) < 0) {
      throw new Error('"addon1" has an invalid value')
    }
    if (killer.indexOf(build.addon2) < 0) {
      throw new Error('"addon2" has an invalid value')
    }
    if (buildOptions.KillerOfferings.indexOf(build.offering) < 0) {
      throw new Error('"offering" has an invalid value')
    }
    if (buildOptions.KillerPerks.indexOf(build.perk1) < 0) {
      throw new Error('"perk1" has an invalid value')
    }
    if (buildOptions.KillerPerks.indexOf(build.perk2) < 0) {
      throw new Error('"perk2" has an invalid value')
    }
    if (buildOptions.KillerPerks.indexOf(build.perk3) < 0) {
      throw new Error('"perk3" has an invalid value')
    }
    if (buildOptions.KillerPerks.indexOf(build.perk4) < 0) {
      throw new Error('"perk4" has an invalid value')
    }
  } else {
    if (build.item && Object.keys(buildOptions.SurvivorItems).indexOf(build.item) < 0) {
      throw new Error('"item" has an invalid value')
    }
    if (build.item !== 'None') {
      const item = buildOptions.SurvivorItems[build.item]
      if (item.indexOf(build.addon1) < 0) {
        throw new Error('"addon1" has an invalid value')
      }
      if (item.indexOf(build.addon2) < 0) {
        throw new Error('"addon2" has an invalid value')
      }
    } else {
      if (build.addon1 !== 'None' || build.addon2 !== 'None') {
        throw new Error('addons are invalid without an item')
      }
    }
    if (buildOptions.SurvivorOfferings.indexOf(build.offering) < 0) {
      throw new Error('"offering" has an invalid value')
    }
    if (buildOptions.SurvivorPerks.indexOf(build.perk1) < 0) {
      throw new Error('"perk1" has an invalid value')
    }
    if (buildOptions.SurvivorPerks.indexOf(build.perk2) < 0) {
      throw new Error('"perk2" has an invalid value')
    }
    if (buildOptions.SurvivorPerks.indexOf(build.perk3) < 0) {
      throw new Error('"perk3" has an invalid value')
    }
    if (buildOptions.SurvivorPerks.indexOf(build.perk4) < 0) {
      throw new Error('"perk4" has an invalid value')
    }
  }
  const lastExpiration = new Date().getTime() + BUILD_EXPIRATION_DURATION
  if (build.expiration !== undefined && build.expiration > lastExpiration) {
    throw new Error('expiration is outside acceptable range')
  }
  return {
    addon1: build.addon1,
    addon2: build.addon2,
    character: build.character,
    expiration: build.expiration ?? lastExpiration,
    item: build.item,
    notes: build.notes,
    offering: build.offering,
    perk1: build.perk1,
    perk2: build.perk2,
    perk3: build.perk3,
    perk4: build.perk4,
  }
}

/* Event */

const parseEventBody = (event: APIGatewayProxyEventV2): any =>
  JSON.parse(
    event.isBase64Encoded && event.body ? Buffer.from(event.body, 'base64').toString('utf8') : (event.body as string)
  )

export const extractBuildFromEvent = (event: APIGatewayProxyEventV2): Build =>
  formatBuild(parseEventBody(event) as Build)

export const extractJsonPatchFromEvent = (event: APIGatewayProxyEventV2): PatchOperation[] =>
  parseEventBody(event) as PatchOperation[]

export const extractSubmitterFromEvent = (event: APIGatewayProxyEventV2): string => parseEventBody(event).submitter

export const extractTokenFromEvent = (event: APIGatewayProxyEventV2): string => event.headers['X-Twitch-Token']
