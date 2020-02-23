import { useState } from "react"
import {
  CompressedString,
  CompressibleObject,
  compress,
  decompress,
} from "src/utils/compress"
import { EncryptedString, decrypt, encrypt } from "src/utils/crypto"

type ReturnValues<TSrc> = {
  compressWithEnc: (src: TSrc, password: string) => Promise<CompressedString>
  decompressWithEnc: (dst: CompressedString, password: string) => Promise<TSrc>
  isCompressingWithEnc: boolean
  isDecompressingWithEnc: boolean
}

type TempCompressSrc = {
  v: EncryptedString
}

export const useCompressorWithCrypto = <
  TSrc extends CompressibleObject
>(): ReturnValues<TSrc> => {
  const [isCompressingWithEnc, setIsCompressingWithEnc] = useState(false)
  const [isDecompressingWithEnc, setIsDecompressingWithEnc] = useState(false)

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
      setIsDecompressingWithEnc(true)
      const temp = await decompress<TempCompressSrc>(dst)
      const src = JSON.parse(decrypt(temp.v, password))
      setIsDecompressingWithEnc(false)
      return src
    },
    isCompressingWithEnc,
    isDecompressingWithEnc,
  }
}
