import { Global, css } from "@emotion/core"
import emotionNormalize from "emotion-normalize"
import React from "react"

type OwnProps = {
  children?: never
}

export const GlobalStyles: React.FC<OwnProps> = () => {
  return <Global styles={globalStyles} />
}

const globalStyles = css`
  ${emotionNormalize}

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`
