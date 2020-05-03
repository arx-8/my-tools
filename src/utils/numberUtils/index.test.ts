import { calc10PerStep, toLocaleStringFixed } from "."

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

describe("toLocaleStringFixed", () => {
  it("can do", () => {
    // ## Assert ##
    // +
    expect(toLocaleStringFixed(100)).toStrictEqual("100")
    expect(toLocaleStringFixed(5_000, 2)).toStrictEqual("5,000.00")
    expect(toLocaleStringFixed(10_000_000.123456789, 3)).toStrictEqual(
      "10,000,000.123"
    )
    expect(toLocaleStringFixed(10_000_000.123456789, 4)).toStrictEqual(
      "10,000,000.1235"
    )

    // -
    expect(toLocaleStringFixed(-100)).toStrictEqual("-100")
    expect(toLocaleStringFixed(-5_000, 2)).toStrictEqual("-5,000.00")
    expect(toLocaleStringFixed(-10_000_000.123456789, 3)).toStrictEqual(
      "-10,000,000.123"
    )
    expect(toLocaleStringFixed(-10_000_000.123456789, 4)).toStrictEqual(
      "-10,000,000.1235"
    )
  })
})
