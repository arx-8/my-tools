import { CastAny } from "src/types/utils"
import { CompressedString } from "src/utils/compress"

import { DynamicRoutePath } from "."

describe("DynamicRoutePath", () => {
  it("Diff with empty", () => {
    // ## Arrange ##
    // ## Act ##
    const result = DynamicRoutePath.diff()

    // ## Assert ##
    expect(result).toStrictEqual("/diff")
  })

  it("Diff with value", () => {
    // ## Arrange ##
    // ## Act ##
    const result = DynamicRoutePath.diff({
      v: "value" as CompressedString,
    })

    // ## Assert ##
    expect(result).toStrictEqual("/diff?v=value")
  })

  it("Diff with some value", () => {
    // ## Arrange ##
    // ## Act ##
    // 可能性を確認したいだけのテストなので、CastAny
    const result = DynamicRoutePath.diff({
      v: "the value",
      v2: "あいうえお",
    } as CastAny)

    // ## Assert ##
    expect(result).toStrictEqual("/diff?v=the value&v2=あいうえお")
  })
})
