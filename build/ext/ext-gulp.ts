import { series } from 'gulp'
import { writeManifest } from './create-manifest'
import { parallelTask } from './rewirte-path'
export default series(
  ...parallelTask(),
  async() => {
    const res = await writeManifest()
    return res
  },
)
