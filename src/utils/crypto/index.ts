import CryptoJS from "crypto-js"
import { Brand } from "utility-types"

export type EncryptedString = Brand<string, "EncryptedString">

export const encrypt = (src: string, password: string): EncryptedString => {
  if (src.length === 0) {
    // パスワードミスの場合、デコード結果が「""」になる
    // デコード結果が正常に空なのか見分けがつかない
    // よって、明示的に「デコード結果が空 = パスワードミス」とするため、空 src は不許可とする
    throw new Error(`Recoverable error. Empty "src" is not allowed.`)
  }

  return CryptoJS.AES.encrypt(src, password).toString() as EncryptedString
}

export const decrypt = (
  encrypted: EncryptedString,
  password: string
): string => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(
    CryptoJS.enc.Utf8
  )

  // チェックサムで軽微なパスワードチェックを実装すべきだが、一旦省く
  // （＝全デコードの結果でチェックする）
  // @see https://stackoverflow.com/a/37663662
  if (decrypted.length === 0) {
    throw new Error(`Recoverable error. Incorrect password.`)
  }

  return decrypted
}
