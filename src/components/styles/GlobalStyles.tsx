import { css, Global } from "@emotion/core"
import { createMuiTheme, ThemeProvider } from "@material-ui/core"
import emotionNormalize from "emotion-normalize"
import React, { ReactChild } from "react"

type OwnProps = {
  children: ReactChild
}

export const GlobalStyles: React.FC<OwnProps> = ({ children }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Global styles={globalStyles} />
      {children}
    </ThemeProvider>
  )
}

/**
 * for emotion
 */
const globalStyles = css`
  ${emotionNormalize}

  body {
    margin: 0;
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
      monospace;
  }
`

/**
 * for material-ui
 */

const muiTheme = createMuiTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
})
