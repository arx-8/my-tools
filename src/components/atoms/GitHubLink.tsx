/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import GitHubIcon from "@material-ui/icons/GitHub"
import React from "react"

export type OwnProps = {
  children?: never
  tabIndex?: number
}

export const GitHubLink: React.FC<OwnProps> = ({ tabIndex }) => {
  return (
    <a
      aria-label="View source on GitHub"
      css={root}
      href="https://github.com/arx-8/my-tools"
      tabIndex={tabIndex}
    >
      <GitHubIcon />
    </a>
  )
}

const root = css`
  color: white;
`
