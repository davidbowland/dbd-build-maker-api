import * as buildOptions from '@utils/build-options'
import { APIGatewayProxyEventV2, Build } from '@types'
import { buildKiller, buildSurvivor, jsonPatchOperations, submitter } from '../__mocks__'
import {
  extractBuildFromEvent,
  extractJsonPatchFromEvent,
  extractSubmitterFromEvent,
  extractTokenFromEvent,
  formatBuild,
  formatSubmitter,
  SubmitterSchema,
} from '@utils/events'
import buildOptionsAsset from '@assets/build-options-chapter-24'
import { mocked } from 'jest-mock'
import patchEventJson from '@events/patch-item.json'
import postEventJson from '@events/post-token.json'
import putEventJson from '@events/put-build.json'

jest.mock('@utils/build-options')

describe('events', () => {
  const disabledOptions = [
    'Blight',
    'Adrenaline Vial',
    'Devout Shrike Wreath',
    'Barbecue & Chilli',
    'Ashley J. Williams',
    'Key',
    'Battery',
    'Black Salt Statuette',
    'Aftercare',
  ]

  beforeAll(() => {
    mocked(buildOptions).getActiveBuildOptions.mockResolvedValue(buildOptionsAsset)
  })

  describe('formatBuild', () => {
    test.each([undefined, 'Fnord', 'Blight', 'Ashley J. Williams'])(
      'expect error on invalid character - %s',
      async (character: string | undefined) => {
        const invalidBuild = { ...buildKiller, character }
        await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
      }
    )

    /* Killer */

    test('expect error when killer disabled', async () => {
      const killerDisabledOptions = ['Killers']
      await expect(formatBuild(buildKiller, killerDisabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Adrenaline Vial'])(
      'expect error on invalid addon1, killer - %s',
      async (addon1) => {
        const invalidBuild = { ...buildKiller, addon1 }
        await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
      }
    )

    test.each([undefined, 'Fnord', 'Adrenaline Vial'])(
      'expect error on invalid addon2, killer - %s',
      async (addon2) => {
        const invalidBuild = { ...buildKiller, addon2 }
        await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
      }
    )

    test.each([undefined, 'Fnord', 'Devout Shrike Wreath'])(
      'expect error on invalid offering, killer - %s',
      async () => {
        const invalidBuild = { ...buildKiller, offering: undefined }
        await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
      }
    )

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk1, killer - %s', async () => {
      const invalidBuild = { ...buildKiller, perk1: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk2, killer - %s', async () => {
      const invalidBuild = { ...buildKiller, perk2: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk3, killer - %s', async () => {
      const invalidBuild = { ...buildKiller, perk3: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk4, killer - %s', async () => {
      const invalidBuild = { ...buildKiller, perk4: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    /* Survivor */

    test('expect error when survivor disabled', async () => {
      const survivorDisabledOptions = ['Survivors']
      await expect(formatBuild(buildSurvivor, survivorDisabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Key'])('expect error on invalid item - %s', async (item) => {
      const invalidBuild = { ...buildSurvivor, item }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Battery'])('expect error on invalid addon1, survivor - %s', async (addon1) => {
      const invalidBuild = { ...buildSurvivor, addon1 }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Battery'])('expect error on invalid addon2, survivor - %s', async (addon2) => {
      const invalidBuild = { ...buildSurvivor, addon2 }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test('expect error on addons without item, survivor', async () => {
      const invalidBuild = { ...buildSurvivor, addon1: 'None', addon2: 'Some', item: 'None' }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Black Salt Statuette'])(
      'expect error on invalid offering, survivor - %s',
      async () => {
        const invalidBuild = { ...buildSurvivor, offering: undefined }
        await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
      }
    )

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk1, survivor - %s', async () => {
      const invalidBuild = { ...buildSurvivor, perk1: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk2, survivor - %s', async () => {
      const invalidBuild = { ...buildSurvivor, perk2: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk3, survivor - %s', async () => {
      const invalidBuild = { ...buildSurvivor, perk3: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk4, survivor - %s', async () => {
      const invalidBuild = { ...buildSurvivor, perk4: undefined }
      await expect(formatBuild(invalidBuild, disabledOptions)).rejects.toThrow()
    })

    /* General */

    test('expect error when expiration too late', async () => {
      const tooLateExpirationBuild = { ...buildKiller, expiration: new Date().getTime() + 100_000_000_000 }
      await expect(formatBuild(tooLateExpirationBuild, disabledOptions)).rejects.toThrow()
    })

    test('expect error when notes invalid', async () => {
      const buildWithNotes = { ...buildKiller, notes: 'Notes!' }
      await expect(formatBuild(buildWithNotes, [...disabledOptions, 'Notes'])).rejects.toThrow()
    })

    test('expect formatted session returned', async () => {
      const result = await formatBuild(buildKiller, disabledOptions)
      expect(result).toEqual(buildKiller)
    })

    test('expect expiration added to build', async () => {
      const { expiration: _, ...buildNoExpiration } = buildKiller

      const result = await formatBuild(buildNoExpiration as unknown as Build, disabledOptions)
      expect(result).toEqual(expect.objectContaining(buildNoExpiration))
      expect(result.expiration).toBeDefined()
    })
  })

  describe('formatSubmitter', () => {
    test('expect submitter when payload valid', async () => {
      const payload: SubmitterSchema = { submitter: 'cfb' }

      const result = formatSubmitter(payload)
      expect(result).toEqual('cfb')
    })

    test('expect thrown exception when payload invalid', async () => {
      const payload = { invalid: 'value' } as unknown as SubmitterSchema

      expect(() => formatSubmitter(payload)).toThrow()
    })
  })

  describe('extractBuildFromEvent', () => {
    const event = putEventJson as unknown as APIGatewayProxyEventV2

    test('expect build from event', async () => {
      const result = await extractBuildFromEvent(event, disabledOptions)
      expect(result).toEqual(expect.objectContaining(buildKiller))
    })

    test('expect build from event in base64', async () => {
      const base64Event = { ...event, body: Buffer.from(event.body).toString('base64'), isBase64Encoded: true }

      const result = await extractBuildFromEvent(base64Event, disabledOptions)
      expect(result).toEqual(expect.objectContaining(buildKiller))
    })

    test('expect reject on invalid event', async () => {
      const tempEvent = { ...event, body: JSON.stringify({}) } as unknown as APIGatewayProxyEventV2
      await expect(extractBuildFromEvent(tempEvent, disabledOptions)).rejects.toThrow()
    })
  })

  describe('extractJsonPatchFromEvent', () => {
    test('expect preference from event', async () => {
      const result = await extractJsonPatchFromEvent(patchEventJson as unknown as APIGatewayProxyEventV2)
      expect(result).toEqual(jsonPatchOperations)
    })
  })

  describe('extractSubmitterFromEvent', () => {
    test('expect submitter from event', async () => {
      const result = await extractSubmitterFromEvent(postEventJson as unknown as APIGatewayProxyEventV2)
      expect(result).toEqual(submitter)
    })
  })

  describe('extractTokenFromEvent', () => {
    test('expect token successfully extracted', () => {
      const result = extractTokenFromEvent(putEventJson as unknown as APIGatewayProxyEventV2)
      expect(result).toEqual('o87ytfvbnmkloiuygvbn')
    })
  })
})
