import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import { Routes } from "src/components/helpers/Routes"
import { GlobalStyles } from "src/components/styles/GlobalStyles"
import * as serviceWorker from "src/serviceWorker"

const App: React.FC = () => {
  return (
    <Fragment>
      <GlobalStyles />
      <Routes />
    </Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
