import { BuildOptions } from '../types'
import { logError } from '../utils/logging'
import releaseDates from '../assets/release-dates'

export const getActiveBuildOptions = async (): Promise<BuildOptions> => {
  const currentTime = new Date()
  for (const release of releaseDates) {
    if (currentTime >= new Date(release.releaseTime)) {
      const optionsModule = await import(`../assets/${release.filename}`)
      return optionsModule.default
    }
  }

  logError('Unable to find active release', { currentTime, releaseDates })
  throw new Error('Unable to find active release')
}
