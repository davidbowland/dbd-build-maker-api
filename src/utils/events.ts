import { APIGatewayProxyEventV2, Build, BuildOptions, PatchOperation } from '../types'
import AJV from 'ajv/dist/jtd'
import { buildUncompletedExpireDuration } from '../config'
import { getActiveBuildOptions } from './build-options'

const ajv = new AJV({ allErrors: true })

export interface BuildSchema extends Omit<Build, 'expiration' | 'submitter'> {
  expiration?: number
}

export interface SubmitterSchema {
  submitter: string
}

export interface ValidBuildValues {
  addons: string[]
  items: string[]
  offerings: string[]
  perks: string[]
}

/* Formatting */

export const formatBuild = async (build: Build, disabledOptions: string[]): Promise<Build> => {
  const buildOptions = await getActiveBuildOptions()

  const isOptionEnabled = (option: string): boolean => disabledOptions.indexOf(option) === -1

  const getValidBuildValues = (buildOptions: BuildOptions, build: Build): ValidBuildValues => {
    const isKiller = Object.keys(buildOptions.killer.characters).indexOf(build.character) >= 0
    if (isKiller) {
      const killer = buildOptions.killer.characters[build.character]
      return {
        addons: killer.filter(isOptionEnabled),
        items: ['Any', 'None'],
        offerings: buildOptions.killer.offerings.filter(isOptionEnabled),
        perks: buildOptions.killer.perks.filter(isOptionEnabled),
      }
    }

    return {
      addons: (build.item ? buildOptions.survivor.items[build.item] : ['None']).filter(isOptionEnabled),
      items: Object.keys(buildOptions.survivor.items).filter(isOptionEnabled),
      offerings: buildOptions.survivor.offerings.filter(isOptionEnabled),
      perks: buildOptions.survivor.perks.filter(isOptionEnabled),
    }
  }

  const characters = (isOptionEnabled('Killers') ? Object.keys(buildOptions.killer.characters) : [])
    .concat(isOptionEnabled('Survivors') ? buildOptions.survivor.characters : [])
    .filter((character) => disabledOptions.indexOf(character) === -1)
  const maximumExpiration = new Date().getTime() + buildUncompletedExpireDuration
  const { addons, items, offerings, perks } = getValidBuildValues(buildOptions, build)

  const notesDefinition = isOptionEnabled('Notes') ? { notes: { type: 'string' } } : {}
  const jsonTypeDefinition = {
    optionalProperties: {
      completed: {
        type: 'float64',
      },
      expiration: {
        type: 'float64',
      },
      item: { enum: items },
      ...notesDefinition,
    },
    properties: {
      addon1: { enum: addons },
      addon2: { enum: addons },
      character: { enum: [...new Set(characters)] }, // Characters has 'Any' twice, one from killers and one survivors
      offering: { enum: offerings },
      perk1: { enum: perks },
      perk2: { enum: perks },
      perk3: { enum: perks },
      perk4: { enum: perks },
    },
  }

  if (ajv.validate(jsonTypeDefinition, build) === false) {
    throw new Error(JSON.stringify(ajv.errors))
  } else if ((build.expiration ?? 0) > maximumExpiration) {
    throw new Error(
      JSON.stringify([
        {
          instancePath: '/expiration',
          keyword: 'value',
          message: 'must be less than the maximum allowed value',
          params: { maximum: [maximumExpiration] },
          schemaPath: '/properties/expiration/value',
        },
      ]),
    )
  }

  return {
    addon1: build.addon1,
    addon2: build.addon2,
    character: build.character,
    expiration: build.expiration ?? maximumExpiration,
    item: build.item,
    notes: build.notes,
    offering: build.offering,
    perk1: build.perk1,
    perk2: build.perk2,
    perk3: build.perk3,
    perk4: build.perk4,
  }
}

const submitterDefinition = {
  properties: {
    submitter: { type: 'string' },
  },
}

export const formatSubmitter = (submitter: SubmitterSchema): string => {
  if (ajv.validate(submitterDefinition, submitter) === false) {
    throw new Error(JSON.stringify(ajv.errors))
  }

  return submitter.submitter
}

/* Event */

const parseEventBody = (event: APIGatewayProxyEventV2): any =>
  JSON.parse(
    event.isBase64Encoded && event.body ? Buffer.from(event.body, 'base64').toString('utf8') : (event.body as string),
  )

export const extractBuildFromEvent = async (event: APIGatewayProxyEventV2, disabledOptions: string[]): Promise<Build> =>
  formatBuild(parseEventBody(event) as Build, disabledOptions)

export const extractJsonPatchFromEvent = (event: APIGatewayProxyEventV2): PatchOperation[] =>
  parseEventBody(event) as PatchOperation[]

export const extractSubmitterFromEvent = (event: APIGatewayProxyEventV2): string =>
  formatSubmitter(parseEventBody(event) as SubmitterSchema)

export const extractTokenFromEvent = (event: APIGatewayProxyEventV2): string =>
  event.headers['x-twitch-token'] as string
