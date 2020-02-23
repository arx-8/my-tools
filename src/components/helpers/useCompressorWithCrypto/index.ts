import { useState } from "react"
import {
  CompressedString,
  CompressibleObject,
  compress,
  decompress,
} from "src/utils/compress"
import { EncryptedString, decrypt, encrypt } from "src/utils/crypto"

export type DecompressingWithDecryptStatus = "ready" | "succeeded" | "failed"

type ReturnValues<TSrc> = {
  compressWithEnc: (src: TSrc, password: string) => Promise<CompressedString>
  decompressWithEnc: (
    dst: CompressedString,
    password: string
  ) => Promise<TSrc | undefined>
  /**
   * 復号は失敗の可能性がある（パスワードミス etc）
   * そのため、boolean ではない
   */
  decompressingWithDecryptStatus: DecompressingWithDecryptStatus
  isCompressingWithEnc: boolean
}

type TempCompressSrc = {
  v: EncryptedString
}

export const useCompressorWithCrypto = <
  TSrc extends CompressibleObject
>(): ReturnValues<TSrc> => {
  const [isCompressingWithEnc, setIsCompressingWithEnc] = useState(false)
  const [
    decompressingWithDecryptStatus,
    setDecompressingWithDecryptStatus,
  ] = useState<DecompressingWithDecryptStatus>("ready")

  return {
    compressWithEnc: async (src, password) => {
      setIsCompressingWithEnc(true)
      // encrypt は string のみ対応のため、全部 string にする
      // compress は Object のみ対応のため、単純な Object にする
      const temp = encrypt(JSON.stringify(src), password)
      const dst = await compress({ v: temp })
      setIsCompressingWithEnc(false)
      return dst
    },
    decompressWithEnc: async (dst, password) => {
      setDecompressingWithDecryptStatus("ready")
      const temp = await decompress<TempCompressSrc>(dst)

      let src
      try {
        src = JSON.parse(decrypt(temp.v, password))
      } catch (error) {
        setDecompressingWithDecryptStatus("failed")
        return undefined
      }
      setDecompressingWithDecryptStatus("succeeded")
      return src
    },
    decompressingWithDecryptStatus,
    isCompressingWithEnc,
  }
}
