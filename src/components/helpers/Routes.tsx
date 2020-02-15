import React from "react"
import { HashRouter, Route, Switch } from "react-router-dom"
import { Diff } from "src/components/pages/Diff"
import { NotFound } from "src/components/pages/NotFound"
import { Root } from "src/components/pages/Root"
import { ReactRouterPath } from "src/constants/path"

type OwnProps = {
  children?: never
}

export const Routes: React.FC<OwnProps> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path={ReactRouterPath.Root} component={Root} />
        <Route exact path={ReactRouterPath.Diff} component={Diff} />

        {/* No route */}
        <Route path={ReactRouterPath.NotFound} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  )
}
