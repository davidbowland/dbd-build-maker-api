import { APIGatewayProxyEventV2, Build } from '@types'
import { buildKiller, buildSurvivor, jsonPatchOperations, submitter } from '../__mocks__'
import {
  extractBuildFromEvent,
  extractJsonPatchFromEvent,
  extractSubmitterFromEvent,
  extractTokenFromEvent,
  formatBuild,
} from '@utils/events'
import patchEventJson from '@events/patch-item.json'
import postEventJson from '@events/post-token.json'
import putEventJson from '@events/put-build.json'

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

  describe('formatBuild', () => {
    test.each([undefined, 'Fnord', 'Blight', 'Ashley J. Williams'])(
      'expect error on invalid character - %s',
      (character: string | undefined) => {
        const invalidBuild = { ...buildKiller, character }
        expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
      }
    )

    /* Killer */

    test.each([undefined, 'Fnord', 'Adrenaline Vial'])('expect error on invalid addon1, killer - %s', (addon1) => {
      const invalidBuild = { ...buildKiller, addon1 }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Adrenaline Vial'])('expect error on invalid addon2, killer - %s', (addon2) => {
      const invalidBuild = { ...buildKiller, addon2 }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Devout Shrike Wreath'])('expect error on invalid offering, killer - %s', () => {
      const invalidBuild = { ...buildKiller, offering: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk1, killer - %s', () => {
      const invalidBuild = { ...buildKiller, perk1: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk2, killer - %s', () => {
      const invalidBuild = { ...buildKiller, perk2: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk3, killer - %s', () => {
      const invalidBuild = { ...buildKiller, perk3: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Barbecue & Chilli'])('expect error on invalid perk4, killer - %s', () => {
      const invalidBuild = { ...buildKiller, perk4: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    /* Survivor */

    test.each([undefined, 'Fnord', 'Key'])('expect error on invalid item - %s', (item) => {
      const invalidBuild = { ...buildSurvivor, item }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Battery'])('expect error on invalid addon1, survivor - %s', (addon1) => {
      const invalidBuild = { ...buildSurvivor, addon1 }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Battery'])('expect error on invalid addon2, survivor - %s', (addon2) => {
      const invalidBuild = { ...buildSurvivor, addon2 }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test('expect error on addons without item, survivor', () => {
      const invalidBuild = { ...buildSurvivor, addon1: 'None', addon2: 'Some', item: 'None' }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Black Salt Statuette'])('expect error on invalid offering, survivor - %s', () => {
      const invalidBuild = { ...buildSurvivor, offering: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk1, survivor - %s', () => {
      const invalidBuild = { ...buildSurvivor, perk1: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk2, survivor - %s', () => {
      const invalidBuild = { ...buildSurvivor, perk2: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk3, survivor - %s', () => {
      const invalidBuild = { ...buildSurvivor, perk3: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    test.each([undefined, 'Fnord', 'Aftercare'])('expect error on invalid perk4, survivor - %s', () => {
      const invalidBuild = { ...buildSurvivor, perk4: undefined }
      expect(() => formatBuild(invalidBuild, disabledOptions)).toThrow()
    })

    /* General */

    test('expect error when expiration too late', () => {
      const tooLateExpirationBuild = { ...buildKiller, expiration: new Date().getTime() + 100_000_000_000 }
      expect(() => formatBuild(tooLateExpirationBuild, disabledOptions)).toThrow()
    })

    test('expect error when notes invalid', () => {
      const buildWithNotes = { ...buildKiller, notes: 'Notes!' }
      expect(() => formatBuild(buildWithNotes, [...disabledOptions, 'Notes'])).toThrow()
    })

    test('expect formatted session returned', () => {
      const result = formatBuild(buildKiller, disabledOptions)
      expect(result).toEqual(buildKiller)
    })

    test('expect expiration added to build', () => {
      const { expiration: _, ...buildNoExpiration } = buildKiller
      const result = formatBuild(buildNoExpiration as unknown as Build, disabledOptions)
      expect(result).toEqual(expect.objectContaining(buildNoExpiration))
      expect(result.expiration).toBeDefined()
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
      expect(() => extractBuildFromEvent(tempEvent, disabledOptions)).toThrow()
    })

    test('expect build to be formatted', async () => {
      const tempBuild = {
        ...buildKiller,
        foo: 'bar',
      }
      const tempEvent = { ...event, body: JSON.stringify(tempBuild) } as unknown as APIGatewayProxyEventV2
      const result = await extractBuildFromEvent(tempEvent, disabledOptions)
      expect(result).toEqual(expect.objectContaining(buildKiller))
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
