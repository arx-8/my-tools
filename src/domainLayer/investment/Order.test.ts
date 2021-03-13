import { newEmptyMoney } from "src/domainLayer/investment/Money"
import type { Order } from "./Order"
import { getWholeSelectStatus } from "./Order"

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
        targetUnitPrice: newEmptyMoney("JPY"),
      },
      {
        orderQuantity: 0,
        selected: false,
        targetUnitPrice: newEmptyMoney("JPY"),
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
        targetUnitPrice: newEmptyMoney("USD"),
      },
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: newEmptyMoney("USD"),
      },
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: newEmptyMoney("USD"),
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
        targetUnitPrice: newEmptyMoney("USD"),
      },
      {
        orderQuantity: 0,
        selected: false,
        targetUnitPrice: newEmptyMoney("USD"),
      },
      {
        orderQuantity: 0,
        selected: true,
        targetUnitPrice: newEmptyMoney("USD"),
      },
    ]

    // ## Act ##
    const result = getWholeSelectStatus(orders)

    // ## Assert ##
    expect(result).toStrictEqual("indeterminate")
  })
})
