/**
 * オブジェクトの value の string literal 型を返す
 */
export type ValueOf<T> = T[keyof T]

/**
 * 修正すべき any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixMeAny = any

/**
 * cast のために使う、修正しなくてよい any
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CastAny = any

export type LabeledValue<T extends string | number> = {
  label: string
  value: T
}

/**
 * for exhaustive check
 */
export const assertNever = (x: never): never => {
  throw new Error(
    `Unexpected value (\`${JSON.stringify(x)}\`). Should have been never.`
  )
}

export function assertNotNull<T>(x: T): asserts x is NonNullable<T> {
  if (x == null) {
    throw new Error(`Unexpected null / undefined. Should have been never.`)
  }
}
