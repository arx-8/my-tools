import { calcLeverage } from "./Money"

describe("calcLeverage", () => {
  it("case by JPY", () => {
    // ## Arrange ##
    // ## Act ##
    const result = calcLeverage(
      {
        asJpy: 1_000_000,
        currency: "JPY",
      },
      {
        asJpy: 1_000,
        currency: "JPY",
      },
      100
    )

    // ## Assert ##
    expect(result).toStrictEqual(0.001)
  })

  it("case by USD", () => {
    // ## Arrange ##
    // ## Act ##
    const result = calcLeverage(
      {
        asJpy: 1_000,
        currency: "JPY",
      },
      {
        asUsd: 100,
        currency: "USD",
      },
      200
    )

    // ## Assert ##
    expect(result).toStrictEqual(20)
  })
})
