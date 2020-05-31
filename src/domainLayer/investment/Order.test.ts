import { getWholeSelectStatus } from "./Order"
import type { Order } from "./Order"

describe("getWholeSelectStatus", () => {
  it("empty", () => {
    // ## Arrange ##
    const orders: Order[] = []

    // ## Act ##
    const result = getWholeSelectStatus(orders)

    // ## Assert ##
    expect(result).toStrictEqual("no-selected")
  })

  it("no-selected", () => {
    // ## Arrange ##
    const orders: Order[] = [
      {
        orderQuantity: 0,
        selected: false,
        targetUnitPrice: {
          asJpy: 0,
          currency: "JPY",
        },
      },
      {
        orderQuantity: 0,
        selected: false,
        targetUnitPrice: {
          asJpy: 0,
          currency: "JPY",
        },
      },
    ]

    // ## Act ##
    const result = getWholeSelectStatus(orders)

    // ## Assert ##
    expect(result).toStrictEqual("no-selected")
  })

  it("all-selected", () => {
    // ## Arrange ##
    const orders: Order[] = [
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: {
          asUsd: 0,
          currency: "USD",
        },
      },
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: {
          asUsd: 0,
          currency: "USD",
        },
      },
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: {
          asUsd: 0,
          currency: "USD",
        },
      },
    ]

    // ## Act ##
    const result = getWholeSelectStatus(orders)

    // ## Assert ##
    expect(result).toStrictEqual("all-selected")
  })

  it("indeterminate", () => {
    // ## Arrange ##
    const orders: Order[] = [
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: {
          asUsd: 0,
          currency: "USD",
        },
      },
      {
        orderQuantity: 0,
        selected: false,
        targetUnitPrice: {
          asUsd: 0,
          currency: "USD",
        },
      },
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: {
          asUsd: 0,
          currency: "USD",
        },
      },
    ]

    // ## Act ##
    const result = getWholeSelectStatus(orders)

    // ## Assert ##
    expect(result).toStrictEqual("indeterminate")
  })
})
