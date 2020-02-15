import { DiffMode, DiffOptions } from "src/utils/diff"

/**
 * URL を少しでも短くするため、キー名は最低限にしている
 */
export type UrlStoreValues = {
  a: string
  b: string
  i: DiffOptions["ignoreCase"]
  m: DiffMode
}

type StateValues = {
  aText: string
  bText: string
  mode: DiffMode
} & DiffOptions

export const toUrlStoreValues = (v: StateValues): UrlStoreValues => {
  return {
    a: v.aText,
    b: v.bText,
    i: v.ignoreCase,
    m: v.mode,
  }
}

export const toStateValues = (v: UrlStoreValues): StateValues => {
  return {
    aText: v.a,
    bText: v.b,
    ignoreCase: v.i,
    mode: v.m,
  }
}
