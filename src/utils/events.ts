import { APIGatewayProxyEventV2, Build, PatchOperation } from '../types'
import { buildUncompletedExpireDuration } from '../config'
import { getActiveBuildOptions } from './build-options'

/* DBD Build Maker */

export const formatBuild = async (build: Build, disabledOptions: string[]): Promise<Build> => {
  const buildOptions = await getActiveBuildOptions()

  const isKiller = Object.keys(buildOptions.killer.characters).indexOf(build.character) >= 0
  if (
    (isKiller && disabledOptions.indexOf('Killers') !== -1) ||
    (!isKiller &&
      (disabledOptions.indexOf('Survivors') !== -1 || buildOptions.survivor.characters.indexOf(build.character) < 0))
  ) {
    throw new Error('"character" has an invalid value')
  }
  if (isKiller) {
    const killer = buildOptions.killer.characters[build.character]
    if (disabledOptions.indexOf(build.addon1) !== -1 || killer.indexOf(build.addon1) < 0) {
      throw new Error('"addon1" has an invalid value')
    }
    if (disabledOptions.indexOf(build.addon2) !== -1 || killer.indexOf(build.addon2) < 0) {
      throw new Error('"addon2" has an invalid value')
    }
    if (disabledOptions.indexOf(build.offering) !== -1 || buildOptions.killer.offerings.indexOf(build.offering) < 0) {
      throw new Error('"offering" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk1) !== -1 || buildOptions.killer.perks.indexOf(build.perk1) < 0) {
      throw new Error('"perk1" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk2) !== -1 || buildOptions.killer.perks.indexOf(build.perk2) < 0) {
      throw new Error('"perk2" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk3) !== -1 || buildOptions.killer.perks.indexOf(build.perk3) < 0) {
      throw new Error('"perk3" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk4) !== -1 || buildOptions.killer.perks.indexOf(build.perk4) < 0) {
      throw new Error('"perk4" has an invalid value')
    }
  } else {
    if (
      build.item &&
      (disabledOptions.indexOf(build.item) !== -1 || Object.keys(buildOptions.survivor.items).indexOf(build.item) < 0)
    ) {
      throw new Error('"item" has an invalid value')
    }
    if (build.item && build.item !== 'None') {
      const item = buildOptions.survivor.items[build.item]
      if (disabledOptions.indexOf(build.addon1) !== -1 || item.indexOf(build.addon1) < 0) {
        throw new Error('"addon1" has an invalid value')
      }
      if (disabledOptions.indexOf(build.addon2) !== -1 || item.indexOf(build.addon2) < 0) {
        throw new Error('"addon2" has an invalid value')
      }
    } else {
      if (build.addon1 !== 'None' || build.addon2 !== 'None') {
        throw new Error('addons are invalid without an item')
      }
    }
    if (disabledOptions.indexOf(build.offering) !== -1 || buildOptions.survivor.offerings.indexOf(build.offering) < 0) {
      throw new Error('"offering" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk1) !== -1 || buildOptions.survivor.perks.indexOf(build.perk1) < 0) {
      throw new Error('"perk1" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk2) !== -1 || buildOptions.survivor.perks.indexOf(build.perk2) < 0) {
      throw new Error('"perk2" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk3) !== -1 || buildOptions.survivor.perks.indexOf(build.perk3) < 0) {
      throw new Error('"perk3" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk4) !== -1 || buildOptions.survivor.perks.indexOf(build.perk4) < 0) {
      throw new Error('"perk4" has an invalid value')
    }
  }
  const lastExpiration = new Date().getTime() + buildUncompletedExpireDuration
  if (build.expiration !== undefined && build.expiration > lastExpiration) {
    throw new Error('expiration is outside acceptable range')
  }
  if (disabledOptions.indexOf('Notes') !== -1 && build.notes) {
    throw new Error('"notes has an invalid value')
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

export const extractBuildFromEvent = async (event: APIGatewayProxyEventV2, disabledOptions: string[]): Promise<Build> =>
  formatBuild(parseEventBody(event) as Build, disabledOptions)

export const extractJsonPatchFromEvent = (event: APIGatewayProxyEventV2): PatchOperation[] =>
  parseEventBody(event) as PatchOperation[]

export const extractSubmitterFromEvent = (event: APIGatewayProxyEventV2): string => parseEventBody(event).submitter

export const extractTokenFromEvent = (event: APIGatewayProxyEventV2): string =>
  event.headers['x-twitch-token'] as string
