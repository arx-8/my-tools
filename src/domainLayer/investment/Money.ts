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
  targetUnitPrice: Money,
  orderQuantity: number,
  usdJpy: number
): number => {
  // 全て JPY に寄せてから計算する
  const accountBalanceAsJpy =
    accountBalance.currency === "JPY"
      ? accountBalance.asJpy
      : accountBalance.asUsd * usdJpy
  const targetUnitPriceAsJpy =
    targetUnitPrice.currency === "JPY"
      ? targetUnitPrice.asJpy
      : targetUnitPrice.asUsd * usdJpy

  return (targetUnitPriceAsJpy * orderQuantity) / accountBalanceAsJpy
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
