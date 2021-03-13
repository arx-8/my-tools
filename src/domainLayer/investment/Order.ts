import {
  addMoney,
  divideMoney,
  Money,
  multiplyMoney,
  newEmptyMoney,
  setMoneyValue,
} from "src/domainLayer/investment/Money"

export type Order = {
  /** 発注数 */
  orderQuantity: number
  selected: boolean
  /** 対象単価 */
  targetUnitPrice: Money
}

/**
 * 発注数も考慮した平均価格を返す
 */
export const calcAveragePrice = (orders: Order[]): Money => {
  if (orders.length === 0) {
    // 0件選択でこの処理に到達する場合もあるため。未選択 = currency 不明のため、とりあえず JPY で返す。
    return newEmptyMoney("JPY")
  }

  const order1st = getHeadOrderStrict(orders)

  const sum = orders
    .map((o) => multiplyMoney(o.targetUnitPrice, o.orderQuantity))
    .reduce(
      (acc, curr) => {
        return addMoney(acc, curr)
      },
      // 同 currency の 0 price を基準にする
      setMoneyValue(order1st.targetUnitPrice, 0)
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

/**
 * 全て選択なし | 全て選択あり | ありなし混在
 */
type WholeSelectStatus = "no-selected" | "all-selected" | "indeterminate"

export const getWholeSelectStatus = (orders: Order[]): WholeSelectStatus => {
  const selecteds = orders.filter((o) => o.selected)
  if (selecteds.length === 0) {
    return "no-selected"
  } else if (selecteds.length === orders.length) {
    return "all-selected"
  } else {
    return "indeterminate"
  }
}
