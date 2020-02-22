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

type BaseStateValues = {
  mode: DiffMode
} & DiffOptions

type CompressStateValues = {
  aText: string
  bText: string
} & BaseStateValues

type DecompressStateValues = {
  aTextInit: string
  bTextInit: string
} & BaseStateValues

export const toUrlStoreValues = (v: CompressStateValues): UrlStoreValues => {
  return {
    a: v.aText,
    b: v.bText,
    i: v.ignoreCase,
    m: v.mode,
  }
}

export const toStateValues = (v: UrlStoreValues): DecompressStateValues => {
  return {
    aTextInit: v.a,
    bTextInit: v.b,
    ignoreCase: v.i,
    mode: v.m,
  }
}
