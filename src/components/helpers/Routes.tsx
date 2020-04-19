import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Diff } from "src/components/pages/Diff"
import { LeverageCalculator } from "src/components/pages/LeverageCalculator"
import { MysqlTableToX } from "src/components/pages/MysqlTableToX"
import { NotFound } from "src/components/pages/NotFound"
import { Root } from "src/components/pages/Root"
import { ReactRouterPath } from "src/constants/path"

type OwnProps = {
  children?: never
}

export const Routes: React.FC<OwnProps> = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Root} exact path={ReactRouterPath.root} />
        <Route component={Diff} exact path={ReactRouterPath.diff} />
        <Route
          component={MysqlTableToX}
          exact
          path={ReactRouterPath.mysql_table_to_x}
        />
        <Route
          component={LeverageCalculator}
          exact
          path={ReactRouterPath.leverage_calculator}
        />

        {/* No route */}
        <Route component={NotFound} path={ReactRouterPath.not_found} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  )
}
