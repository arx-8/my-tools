import {
  BaseOptions,
  Change,
  diffChars,
  diffLines,
  diffSentences,
  diffTrimmedLines,
  diffWords,
} from "diff"
import { ValueOf } from "src/types/utils"
import { DeepNonNullable } from "utility-types"

// 特殊なやつら
// applyPatch,
// createPatch,

/**
 * DiffMode
 */
export type DiffMode =
  | "Chars"
  | "Lines"
  | "Sentences"
  | "TrimmedLines"
  | "Words"

export const DiffModeValues = [
  "Chars",
  "Lines",
  "Sentences",
  "TrimmedLines",
  "Words",
] as const

// 定義忘れチェック用の型
type CheckDiffModeValues = Exclude<DiffMode, ValueOf<typeof DiffModeValues>>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _checkDiffModeValues: never = null as CheckDiffModeValues

/**
 * DiffOptions
 */
export type DiffOptions = {} & DeepNonNullable<BaseOptions>

export type DiffOptionKey = keyof DiffOptions

export const DiffOptionKeys = ["ignoreCase"] as const

// 定義忘れチェック用の型
type CheckDiffOptions = Exclude<DiffOptionKey, ValueOf<typeof DiffOptionKeys>>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _checkDiffOptions: never = null as CheckDiffOptions

export const diff = (
  aText: string,
  bText: string,
  diffMode: DiffMode,
  options: BaseOptions
): Change[] => {
  switch (diffMode) {
    case "Chars":
      return diffChars(aText, bText, options)
    case "Lines":
      return diffLines(aText, bText, options)
    case "Sentences":
      return diffSentences(aText, bText, options)
    case "TrimmedLines":
      return diffTrimmedLines(aText, bText, options)
    case "Words":
      return diffWords(aText, bText, options)

    default:
      // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = diffMode
      throw new Error(`ExhaustiveCheck error. Unexpected diffMode: ${diffMode}`)
  }
}
