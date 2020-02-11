import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Root } from "src/components/pages/Root"
import { GlobalStyles } from "src/components/styles/GlobalStyles"
import * as serviceWorker from "src/serviceWorker"

const App: React.FC = () => {
  return (
    <Fragment>
      <GlobalStyles />
      <Root />
    </Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
