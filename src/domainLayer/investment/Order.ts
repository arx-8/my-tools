import {
  Money,
  addMoney,
  divideMoney,
  multiplyMoney,
  setMoneyValue,
} from "src/domainLayer/investment/Money"

export type Order = {
  /** 発注数 */
  orderQuantity: number
  /** 対象単価 */
  targetUnitPrice: Money
}

/**
 * 発注数も考慮した平均価格を返す
 */
export const calcAveragePrice = (orders: Order[]): Money => {
  const sum = orders
    .map((o) => multiplyMoney(o.targetUnitPrice, o.orderQuantity))
    .reduce(
      (acc, curr) => {
        return addMoney(acc, curr)
      },
      // 同 currency の 0 price を基準にする
      setMoneyValue(getHeadOrderStrict(orders).targetUnitPrice, 0)
    )

  return divideMoney(
    sum,
    orders.reduce((acc, curr) => (acc += curr.orderQuantity), 0)
  )
}

/**
 * orders が同一 currency である前提の使用で組んだロジックが多い
 * そのため、安全な head 取得をよくやるため、この function を実装している
 */
export const getHeadOrderStrict = (orders: Order[]): Order => {
  if (orders[0] == null) {
    throw new Error("Logic Failure: 'orders' must have 1 or more elements")
  }
  return orders[0]
}
