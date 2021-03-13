/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/react"
import React from "react"
import diffIcon from "src/assets/diffIcon.jpg"

type OwnProps = {
  children?: never
  exCss?: SerializedStyles
}

export const DiffIcon: React.FC<OwnProps> = ({ exCss }) => {
  return <img alt="diffIcon" css={exCss} src={diffIcon} />
}
