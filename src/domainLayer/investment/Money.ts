import { Currency } from "src/domainLayer/investment/Currency"
import { assertNever } from "src/types/utils"

export type Money = JPY | USD

export type USD = {
  asUsd: number
  currency: "USD"
}

export type JPY = {
  asJpy: number
  currency: "JPY"
}

/**
 * 非破壊・参照透過である
 */
export const setMoneyCurrency = (v: Money, nextCurrency: Currency): Money => {
  if (v.currency === "JPY" && v.currency !== nextCurrency) {
    return {
      asUsd: v.asJpy,
      currency: nextCurrency,
    }
  } else if (v.currency === "USD" && v.currency !== nextCurrency) {
    return {
      asJpy: v.asUsd,
      currency: nextCurrency,
    }
  }

  return v
}

/**
 * 非破壊・参照透過である
 */
export const setMoneyValue = (v: Money, value: number): Money => {
  switch (v.currency) {
    case "JPY":
      return {
        asJpy: value,
        currency: v.currency,
      }
    case "USD":
      return {
        asUsd: value,
        currency: v.currency,
      }
    default:
      return assertNever(v)
  }
}

export const convertCurrency = (
  fromValue: Money,
  toCurrency: Currency,
  usdJpy: number
): Money => {
  // from, to が同じなら、何もしない
  if (fromValue.currency === toCurrency) {
    return fromValue
  }

  switch (fromValue.currency) {
    case "JPY":
      return {
        asUsd: fromValue.asJpy / usdJpy,
        currency: "USD",
      }

    case "USD":
      return {
        asJpy: fromValue.asUsd * usdJpy,
        currency: "JPY",
      }

    default:
      return assertNever(fromValue)
  }
}

export const getMoneyValue = (v: Money): number => {
  switch (v.currency) {
    case "JPY":
      return v.asJpy
    case "USD":
      return v.asUsd
    default:
      return assertNever(v)
  }
}

export const getMoneyValueAsJpy = (v: Money, usdJpy: number): number => {
  switch (v.currency) {
    case "JPY":
      return v.asJpy
    case "USD":
      return v.asUsd * usdJpy
    default:
      return assertNever(v)
  }
}

export const multiplyMoney = (v: Money, multiplyNum: number): Money => {
  return setMoneyValue(v, getMoneyValue(v) * multiplyNum)
}

export const addMoney = (a: Money, b: Money): Money => {
  switch (a.currency) {
    case "JPY":
      if (a.currency !== b.currency) {
        throw new Error(
          `Currencies must be equal. a=${a.currency}, b=${b.currency}`
        )
      }

      return {
        asJpy: a.asJpy + b.asJpy,
        currency: "JPY",
      }

    case "USD":
      if (a.currency !== b.currency) {
        throw new Error(
          `Currencies must be equal. a=${a.currency}, b=${b.currency}`
        )
      }

      return {
        asUsd: a.asUsd + b.asUsd,
        currency: "USD",
      }

    default:
      return assertNever(a)
  }
}

export const divideMoney = (v: Money, denominator: number): Money => {
  if (denominator === 0) {
    // ZeroDivisionError guard
    // 実用的な操作では発生しないが入力はできてしまうため、実装している
    return setMoneyValue(v, Infinity)
  }

  switch (v.currency) {
    case "JPY":
      return {
        asJpy: v.asJpy / denominator,
        currency: v.currency,
      }

    case "USD":
      return {
        asUsd: v.asUsd / denominator,
        currency: v.currency,
      }

    default:
      return assertNever(v)
  }
}

/**
 * 四捨五入
 */
export const roundMoney = (v: Money): Money => {
  switch (v.currency) {
    case "JPY":
      return {
        asJpy: Math.round(v.asJpy),
        currency: v.currency,
      }

    case "USD":
      return {
        asUsd: Math.round(v.asUsd),
        currency: v.currency,
      }

    default:
      return assertNever(v)
  }
}

/**
 * "発注価格" を計算して返す
 */
export const calcOrderPrice = (
  targetUnitPrice: Money,
  orderQuantity: number
): Money => {
  return setMoneyValue(
    targetUnitPrice,
    getMoneyValue(targetUnitPrice) * orderQuantity
  )
}

/**
 * "レバレッジ" を計算して返す
 */
export const calcLeverage = (
  accountBalance: Money,
  price: Money,
  usdJpy: number
): number => {
  // 全て JPY に寄せてから計算する
  const accountBalanceAsJpy = convertCurrency(
    accountBalance,
    "JPY",
    usdJpy
  ) as JPY
  const priceAsJpy = convertCurrency(price, "JPY", usdJpy) as JPY

  return priceAsJpy.asJpy / accountBalanceAsJpy.asJpy
}

/**
 * "損益" を計算して返す
 */
export const calcProfitOrLossAsJpy = (
  comparePrice: number,
  targetUnitPrice: Money,
  orderQuantity: number,
  isLong: boolean,
  usdJpy: number
): JPY => {
  const targetUnitPriceAsJpy =
    targetUnitPrice.currency === "JPY"
      ? targetUnitPrice.asJpy
      : targetUnitPrice.asUsd * usdJpy

  const comparePriceAsJpy =
    targetUnitPrice.currency === "JPY" ? comparePrice : comparePrice * usdJpy

  const price = isLong
    ? (comparePriceAsJpy - targetUnitPriceAsJpy) * orderQuantity
    : (targetUnitPriceAsJpy - comparePriceAsJpy) * orderQuantity

  return {
    asJpy: price,
    currency: "JPY",
  }
}
