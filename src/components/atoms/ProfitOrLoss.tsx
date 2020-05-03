/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { green, grey, red } from "@material-ui/core/colors"
import React from "react"
import { monospaceFont } from "src/components/styles/styles"
import { toLocaleStringFixed } from "src/utils/numberUtils"

type Props = {
  value: number
}

/**
 * ＋値の場合は、＋値とわかりやすいデザインの文字列
 */
export const ProfitOrLoss: React.FC<Props> = ({ value }) => {
  // 小数部分を色分けすることで、正確性を保ちつつ些事が目に付かないようにする
  const [integer, decimal] = toLocaleStringFixed(value, 3).split(".") as [
    string,
    string | undefined
  ]

  return (
    <span css={monospaceFont}>
      {value < 0 ? (
        <span css={loss}>{integer}</span>
      ) : (
        <span css={profit}>+{integer}</span>
      )}
      <span css={decimalCss}>.{decimal ?? "0"}</span>
    </span>
  )
}

const loss = css`
  color: ${red["800"]};
`

const profit = css`
  color: ${green["800"]};
`

const decimalCss = css`
  color: ${grey["500"]};
`

/**
 * ＋値の場合はただの文字列
 */
export const PriceOrLoss: React.FC<Props> = ({ value }) => {
  const [integer, decimal] = toLocaleStringFixed(value, 3).split(".") as [
    string,
    string | undefined
  ]

  return (
    <span css={monospaceFont}>
      <span css={value < 0 ? loss : undefined}>{integer}</span>
      <span css={decimalCss}>.{decimal ?? "0"}</span>
    </span>
  )
}
