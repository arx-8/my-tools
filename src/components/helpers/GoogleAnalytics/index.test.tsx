import { convertRealPathname } from "."

describe("convertRealPathname", () => {
  it("normal", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertRealPathname("/", "#/")

    // ## Assert ##
    expect(result).toStrictEqual("/#/")
  })

  it("without query", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertRealPathname("/", "#/diff")

    // ## Assert ##
    expect(result).toStrictEqual("/#/diff")
  })

  it("with query", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertRealPathname("/", "#/diff?v=XQA")

    // ## Assert ##
    expect(result).toStrictEqual("/#/diff?")
  })

  it("with some queries", () => {
    // ## Arrange ##
    // ## Act ##
    const result = convertRealPathname("/", "#/some/complex/path?q1=XQA&q2=0")

    // ## Assert ##
    expect(result).toStrictEqual("/#/some/complex/path?")
  })
})
