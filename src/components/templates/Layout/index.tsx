/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import React, { ReactNode } from "react"
import { AppBar } from "src/components/organisms/AppBar"

type OwnProps = {
  children: ReactNode
}

export const Layout: React.FC<OwnProps> = ({ children }) => {
  return (
    <div css={root}>
      <AppBar />
      <div>{children}</div>
    </div>
  )
}

const root = css``
