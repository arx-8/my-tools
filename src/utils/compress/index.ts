import produce from "immer"
import jsonurl from "json-url"
import { Brand, FixMeAny } from "src/types/utils"

/**
 * 実装の簡素化のため、1階層のフラットな json のみ対応
 */
export type CompressibleObject = Record<string, string | number | boolean>

export type CompressedString = Brand<string, "CompressedString">

export function assertIsCompressedString(
  x: unknown
): asserts x is CompressedString {
  if (typeof x !== "string") {
    throw new Error(`Not a CompressedString! x:${x}`)
  }
}

// lzma が最も圧縮率が高い
const codec = jsonurl<CompressibleObject>("lzma")

export const compress = async (
  src: CompressibleObject
): Promise<CompressedString> => {
  // json-url がマルチバイト非対応のため、文字列はパーセントエンコードする
  // キー名がマルチバイト文字なケースは考慮しない（そんなコード書くケースは滅多にいないため）
  const encodedObj = produce(src, (draft) => {
    Object.keys(src).forEach((key) => {
      const v = draft[key]
      if (typeof v === "string") {
        draft[key] = encodeURIComponent(v)
      }
    })
  })

  return (await codec.compress(encodedObj)) as CompressedString
}

export const decompress = async <TSrc extends CompressibleObject>(
  dst: CompressedString
): Promise<TSrc> => {
  const encodedObj = await codec.decompress(dst)

  const decodedObj = produce(encodedObj, (draft) => {
    Object.keys(encodedObj).forEach((key) => {
      const v = draft[key]
      if (typeof v === "string") {
        draft[key] = decodeURIComponent(v)
      }
    })
  })

  return decodedObj as FixMeAny
}
