import { mocked } from 'jest-mock'

import * as releaseDates from '@assets/release-dates'
import chapter25 from '@assets/build-options-chapter-25'
import chapter26 from '@assets/build-options-chapter-26'
import { getActiveBuildOptions } from '@utils/build-options'
import { releases } from '../__mocks__'

jest.mock('@assets/release-dates')
jest.mock('@utils/logging')

describe('build-options', () => {
  beforeEach(() => {
    mocked(releaseDates).default = releases
  })

  afterEach(() => {
    jest.resetModules()
  })

  test('expect latest release (chapter 25) options to be returned', async () => {
    const result = await getActiveBuildOptions()
    expect(result).toEqual(chapter25)
  })

  test('expect latest release (chapter 26) options when release updated', async () => {
    mocked(releaseDates).default = [
      {
        filename: 'build-options-chapter-26',
        releaseTime: '2002-11-22T16:00:00Z',
      },
      ...releases,
    ]

    const result = await getActiveBuildOptions()
    expect(result).toEqual(chapter26)
  })

  test('expect function rejects when build options file is missing', async () => {
    mocked(releaseDates).default = [
      {
        filename: 'build-options-chapter-doesnt-exist',
        releaseTime: '1969-07-20T00:00:00Z',
      },
      ...releases,
    ]

    const result = await getActiveBuildOptions()
    expect(result).toEqual(chapter25)
  })

  test('expect function rejects when no options are found', async () => {
    mocked(releaseDates).default = []

    await expect(getActiveBuildOptions()).rejects.toThrow()
  })
})
