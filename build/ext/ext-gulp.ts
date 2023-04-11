import { series } from 'gulp'
import { writeManifest } from './create-manifest'
export default series(
  async() => {
    const res = await writeManifest()
    return res
  },
)
