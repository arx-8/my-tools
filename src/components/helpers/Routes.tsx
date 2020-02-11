import React from "react"
import { HashRouter, Route, Switch } from "react-router-dom"
import { NotFound } from "src/components/pages/NotFound"
import { Root } from "src/components/pages/Root"
import { RoutePath } from "src/constants/path"

type OwnProps = {
  children?: never
}

export const Routes: React.FC<OwnProps> = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path={RoutePath.Root} component={Root} />

        {/* No route */}
        <Route path={RoutePath.NotFound} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  )
}
