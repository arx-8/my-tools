import { calc10PerStep } from "."

describe("calc10PerStep", () => {
  it("can calc", () => {
    // ## Assert ##
    expect(calc10PerStep(-9999)).toStrictEqual(100)
    expect(calc10PerStep(-100)).toStrictEqual(10)
    expect(calc10PerStep(-99)).toStrictEqual(1)
    expect(calc10PerStep(-10)).toStrictEqual(1)
    expect(calc10PerStep(-9)).toStrictEqual(1)
    expect(calc10PerStep(0)).toStrictEqual(1)
    expect(calc10PerStep(undefined)).toStrictEqual(1)
    expect(calc10PerStep(9)).toStrictEqual(1)
    expect(calc10PerStep(10)).toStrictEqual(1)
    expect(calc10PerStep(99)).toStrictEqual(1)
    expect(calc10PerStep(100)).toStrictEqual(10)
    expect(calc10PerStep(1234)).toStrictEqual(100)
  })
})
