import { convertFullPathnameWithoutQueryParams } from "."

describe("convertFullPathnameWithoutQueryParams", () => {
  it("normal", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertFullPathnameWithoutQueryParams("/", "#/")

    // ## Assert ##
    expect(result).toStrictEqual("/#/")
  })

  it("without query", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertFullPathnameWithoutQueryParams("/", "#/diff")

    // ## Assert ##
    expect(result).toStrictEqual("/#/diff")
  })

  it("with query", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertFullPathnameWithoutQueryParams("/", "#/diff?v=XQA")

    // ## Assert ##
    expect(result).toStrictEqual("/#/diff?")
  })

  it("with some queries", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertFullPathnameWithoutQueryParams(
      "/",
      "#/some/complex/path?q1=XQA&q2=0"
    )

    // ## Assert ##
    expect(result).toStrictEqual("/#/some/complex/path?")
  })
})
