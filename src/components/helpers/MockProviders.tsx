import React, { ReactElement } from "react"
import { HashRouter } from "react-router-dom"

type OwnProps = {
  children: ReactElement
}

/**
 * UnitTest で Hooks や HoC 付きの Component を rendering するため
 */
export const MockProviders: React.FC<OwnProps> = ({ children }) => {
  return <HashRouter>{children}</HashRouter>
}
