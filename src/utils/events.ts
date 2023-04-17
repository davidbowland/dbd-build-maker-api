import { APIGatewayProxyEventV2, Build, PatchOperation } from '../types'
import buildOptions from '../assets/build-options.json'
import { buildUncompletedExpireDuration } from '../config'

/* DBD Build Maker */

export const formatBuild = (build: Build, disabledOptions: string[]): Build => {
  const isKiller = Object.keys(buildOptions.Killers).indexOf(build.character) >= 0
  if (
    (isKiller && disabledOptions.indexOf('Killers') !== -1) ||
    (!isKiller && (disabledOptions.indexOf('Survivors') !== -1 || buildOptions.Survivors.indexOf(build.character) < 0))
  ) {
    throw new Error('"character" has an invalid value')
  }
  if (isKiller) {
    const killer = buildOptions.Killers[build.character as keyof typeof buildOptions.Killers]
    if (disabledOptions.indexOf(build.addon1) !== -1 || killer.indexOf(build.addon1) < 0) {
      throw new Error('"addon1" has an invalid value')
    }
    if (disabledOptions.indexOf(build.addon2) !== -1 || killer.indexOf(build.addon2) < 0) {
      throw new Error('"addon2" has an invalid value')
    }
    if (
      disabledOptions.indexOf(build.offering) !== -1 ||
      buildOptions['Killer Offerings'].indexOf(build.offering) < 0
    ) {
      throw new Error('"offering" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk1) !== -1 || buildOptions['Killer Perks'].indexOf(build.perk1) < 0) {
      throw new Error('"perk1" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk2) !== -1 || buildOptions['Killer Perks'].indexOf(build.perk2) < 0) {
      throw new Error('"perk2" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk3) !== -1 || buildOptions['Killer Perks'].indexOf(build.perk3) < 0) {
      throw new Error('"perk3" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk4) !== -1 || buildOptions['Killer Perks'].indexOf(build.perk4) < 0) {
      throw new Error('"perk4" has an invalid value')
    }
  } else {
    if (
      build.item &&
      (disabledOptions.indexOf(build.item) !== -1 ||
        Object.keys(buildOptions['Survivor Items']).indexOf(build.item) < 0)
    ) {
      throw new Error('"item" has an invalid value')
    }
    if (build.item && build.item !== 'None') {
      const item = buildOptions['Survivor Items'][build.item as keyof (typeof buildOptions)['Survivor Items']]
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
    if (
      disabledOptions.indexOf(build.offering) !== -1 ||
      buildOptions['Survivor Offerings'].indexOf(build.offering) < 0
    ) {
      throw new Error('"offering" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk1) !== -1 || buildOptions['Survivor Perks'].indexOf(build.perk1) < 0) {
      throw new Error('"perk1" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk2) !== -1 || buildOptions['Survivor Perks'].indexOf(build.perk2) < 0) {
      throw new Error('"perk2" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk3) !== -1 || buildOptions['Survivor Perks'].indexOf(build.perk3) < 0) {
      throw new Error('"perk3" has an invalid value')
    }
    if (disabledOptions.indexOf(build.perk4) !== -1 || buildOptions['Survivor Perks'].indexOf(build.perk4) < 0) {
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

export const extractBuildFromEvent = (event: APIGatewayProxyEventV2, disabledOptions: string[]): Build =>
  formatBuild(parseEventBody(event) as Build, disabledOptions)

export const extractJsonPatchFromEvent = (event: APIGatewayProxyEventV2): PatchOperation[] =>
  parseEventBody(event) as PatchOperation[]

export const extractSubmitterFromEvent = (event: APIGatewayProxyEventV2): string => parseEventBody(event).submitter

export const extractTokenFromEvent = (event: APIGatewayProxyEventV2): string =>
  event.headers['x-twitch-token'] as string
