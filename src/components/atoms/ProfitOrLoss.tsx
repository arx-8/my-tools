/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { green, red } from "@material-ui/core/colors"
import React from "react"
import { monospaceFont } from "src/components/styles/styles"

type Props = {
  value: number
}

/**
 * ＋値の場合は、＋値とわかりやすいデザインの文字列
 */
export const ProfitOrLoss: React.FC<Props> = ({ value }) => {
  return value < 0 ? (
    <span css={[monospaceFont, loss]}>{value.toLocaleString()}</span>
  ) : (
    <span css={[monospaceFont, profit]}>+{value.toLocaleString()}</span>
  )
}

const loss = css`
  color: ${red["800"]};
`

const profit = css`
  color: ${green["800"]};
`

/**
 * ＋値の場合はただの文字列
 */
export const PriceOrLoss: React.FC<Props> = ({ value }) => {
  return value < 0 ? (
    <span css={[monospaceFont, loss]}>{value.toLocaleString()}</span>
  ) : (
    <span css={monospaceFont}>{value.toLocaleString()}</span>
  )
}
