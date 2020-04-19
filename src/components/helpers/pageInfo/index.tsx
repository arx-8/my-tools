/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { DiffIcon } from "src/components/atoms/DiffIcon"
import { InvestmentIcon } from "src/components/atoms/InvestmentIcon"
import { MysqlIcon } from "src/components/atoms/MysqlIcon"
import { DynamicRoutePath, StaticRoutePath } from "src/constants/path"

const icon = css`
  height: 32px;
`

export const pageInfo = [
  {
    icon: <DiffIcon exCss={icon} />,
    linkTo: DynamicRoutePath.diff(),
    title: "Bookmarkable Diff",
  },
  {
    icon: <MysqlIcon exCss={icon} />,
    linkTo: StaticRoutePath.mysql_table_to_x,
    title: "MySQL table to X",
  },
  {
    icon: <InvestmentIcon exCss={icon} />,
    linkTo: StaticRoutePath.leverage_calculator,
    title: "Leverage Calculator",
  },
]
