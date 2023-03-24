export * from './log'
export const isEmptyObj = (item: unknown): boolean => JSON.stringify(item) === '{}'
