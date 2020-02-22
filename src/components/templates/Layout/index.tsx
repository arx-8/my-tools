/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Container } from "@material-ui/core"
import React, { Fragment, ReactNode } from "react"
import { AppBar } from "src/components/organisms/AppBar"

type OwnProps = {
  children: ReactNode
}

export const Layout: React.FC<OwnProps> = ({ children }) => {
  return (
    <Fragment>
      <div css={top}>
        <AppBar />
      </div>
      <div css={body}>
        <Container
          style={{
            height: "100%",
          }}
          maxWidth="xl"
        >
          {children}
        </Container>
      </div>
    </Fragment>
  )
}

const TopVh = 6

const top = css`
  height: ${TopVh}vh;
`

const body = css`
  height: ${100 - TopVh}vh;
`
