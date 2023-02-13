export const entry = {
  index: '../packages/entry/index.ts',
  core: '../packages/core/index.ts',
  bin: '../packages/bin/index.ts',
  utils: '../utils/index.ts',
}

export const distDirMap = {
  '@pr-checker/utils': 'dist/utils/index[format]',
  '@pr-checker/core': 'dist/core/index[format]',
  '@pr-checker/bin': 'dist/bin/index[format]',
}
