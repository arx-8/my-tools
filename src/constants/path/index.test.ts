import { CompressedString } from "src/utils/compress"

import { DynamicRoutePath } from "."

describe("DynamicRoutePath", () => {
  it("Diff with empty", () => {
    // ## Arrange ##
    // ## Act ##
    const result = DynamicRoutePath.Diff()

    // ## Assert ##
    expect(result).toStrictEqual("/diff")
  })

  it("Diff with value", () => {
    // ## Arrange ##
    // ## Act ##
    const result = DynamicRoutePath.Diff({
      v: "value" as CompressedString,
    })

    // ## Assert ##
    expect(result).toStrictEqual("/diff?v=value")
  })

  it("Diff with encrypt flag", () => {
    // ## Arrange ##
    // ## Act ##
    const result = DynamicRoutePath.Diff({
      e: "y",
      v: "あいうえお" as CompressedString,
    })

    // ## Assert ##
    expect(result).toStrictEqual("/diff?e=y&v=あいうえお")
  })
})
