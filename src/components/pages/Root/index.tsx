/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import React from "react"
import logo from "src/assets/logo.svg"
import { Layout } from "src/components/templates/Layout"

type OwnProps = {
  children?: never
}

export const Root: React.FC<OwnProps> = () => {
  return (
    <Layout>
      <div css={root}>
        <header css={header}>
          <img alt="logo" css={logoCss} src={logo} />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            css={link}
            href="https://reactjs.org"
            rel="noopener noreferrer"
            target="_blank"
          >
            Learn React
          </a>
        </header>
      </div>
    </Layout>
  )
}

const root = css`
  text-align: center;
`

const header = css`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

const logoCss = css`
  animation: App-logo-spin infinite 20s linear;
  height: 40vmin;
  pointer-events: none;

  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const link = css`
  color: #61dafb;
`
