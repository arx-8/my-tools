/** @jsx jsx */
import { SerializedStyles, css, jsx } from "@emotion/core"
import React from "react"
import { ReactComponent as Svg } from "src/assets/investment.svg"
import { CastAny } from "src/types/utils"

type OwnProps = {
  children?: never
  exCss?: SerializedStyles
} & React.SVGProps<CastAny>

export const InvestmentIcon: React.FC<OwnProps> = ({ exCss, ...rest }) => {
  return <Svg {...rest} css={[root, exCss]} />
}

const root = css`
  g {
    /* TODO 親 css から color で上書き可能にするため */
    /* fill: currentColor; */
  }
`
