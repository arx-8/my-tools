/* eslint-disable no-irregular-whitespace */
import { EncryptedString, decrypt, encrypt } from "."

describe("encrypt", () => {
  it("same source, but random result", () => {
    // ## Arrange ##
    const src = "abc あいう　\n　えお"
    const password = "The Password"

    // ## Act ##
    const result1 = encrypt(src, password)
    const result2 = encrypt(src, password)

    // ## Assert ##
    expect(result1).not.toStrictEqual(result2)
  })
})

describe("decrypt", () => {
  it("valid password", () => {
    // ## Arrange ##
    const encrypted = "U2FsdGVkX1/JyykvEbC7epBhTJJ2MY/hBm5S1wVHbFeoYzVwlk7HYlCPzExRZddQ" as EncryptedString
    const password = "The Password"

    // ## Act ##
    const result = decrypt(encrypted, password)

    // ## Assert ##
    expect(result).toStrictEqual("abc あいう　\n　えお")
  })

  it("invalid password", () => {
    // ## Arrange ##
    const encrypted = "U2FsdGVkX1/JyykvEbC7epBhTJJ2MY/hBm5S1wVHbFeoYzVwlk7HYlCPzExRZddQ" as EncryptedString
    const password = "INVALID"

    // ## Act ##
    // ## Assert ##
    expect(() => {
      decrypt(encrypted, password)
    }).toThrowErrorMatchingInlineSnapshot(
      `"Recoverable error. Incorrect password."`
    )
  })
})

describe("whole", () => {
  it("UTF-8 src", () => {
    // ## Arrange ##
    const src = `
寿限無　寿限無　五劫のすりきれ
海砂利水魚の水行末　雲来末　風来末
食う寝るところに住むところ
やぶら小路のぶら小路
パイポパイポ　パイポのシューリンガン
シューリンガンのクーリンダイ
クーリンダイのポンポコナーのポンポコピーの
長久命の長助`
    const password = "the password"

    // ## Act ##
    const encrypted = encrypt(src, password)
    const result = decrypt(encrypted, password)

    // ## Assert ##
    expect(result).toStrictEqual(src)
  })

  it("Emoji src", () => {
    // ## Arrange ##
    const src = "😂🐬😃"
    const password = "password"

    // ## Act ##
    const encrypted = encrypt(src, password)
    const result = decrypt(encrypted, password)

    // ## Assert ##
    expect(result).toStrictEqual(src)
  })
})
