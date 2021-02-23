/** @jsxRuntime classic */
/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/react"
import React from "react"
import diffIcon from "src/assets/diffIcon.jpg"
import { CastAny } from "src/types/utils"

type OwnProps = {
  children?: never
  exCss?: InterpolationWithTheme<CastAny>
}

export const DiffIcon: React.FC<OwnProps> = ({ exCss }) => {
  return <img alt="diffIcon" css={exCss} src={diffIcon} />
}
