import { CastAny } from "src/types/utils"

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
      v: "value",
    } as CastAny)

    // ## Assert ##
    expect(result).toStrictEqual("/diff?v=value")
  })

  it("Diff with some value", () => {
    // ## Arrange ##
    // ## Act ##
    const result = DynamicRoutePath.Diff({
      v: "the value",
      v2: "あいうえお",
    } as CastAny)

    // ## Assert ##
    expect(result).toStrictEqual("/diff?v=the value&v2=あいうえお")
  })
})
