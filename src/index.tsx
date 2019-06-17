import { Root } from "components/pages/Root"
import { GlobalStyles } from "components/styles/GlobalStyles"
import React from "react"
import ReactDOM from "react-dom"
import * as serviceWorker from "./serviceWorker"

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Root />
    </>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
