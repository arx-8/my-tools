import { useState } from "react"
import {
  compress as _compress,
  CompressedString,
  CompressibleObject,
  decompress as _decompress,
} from "src/utils/compress"
import { sleep } from "src/utils/threadUtils"

type ReturnValues<TSrc> = {
  compress: (src: TSrc) => Promise<CompressedString>
  decompress: (dst: CompressedString) => Promise<TSrc>
  isCompressing: boolean
  isDecompressing: boolean
}

export const useCompressor = <
  TSrc extends CompressibleObject
>(): ReturnValues<TSrc> => {
  const [isCompressing, setIsCompressing] = useState(false)
  const [isDecompressing, setIsDecompressing] = useState(false)

  return {
    compress: async (src) => {
      setIsCompressing(true)
      // 処理完了が速すぎても loading を知覚できなくなってしまうため、わざと最低待ち時間を入れてる
      const [dst] = await Promise.all([_compress(src), sleep(400)])
      setIsCompressing(false)
      return dst
    },
    decompress: async (dst) => {
      setIsDecompressing(true)
      const src = await _decompress<TSrc>(dst)
      setIsDecompressing(false)
      return src
    },
    isCompressing,
    isDecompressing,
  }
}
