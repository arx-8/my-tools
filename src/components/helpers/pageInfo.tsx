/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { DiffIcon } from "src/components/atoms/DiffIcon"
import { RoutePath } from "src/constants/path"

const icon = css`
  height: 32px;
`

export const pageInfo = [
  {
    icon: <DiffIcon exCss={icon} />,
    linkTo: RoutePath.Diff,
    title: "Bookmarkable Diff",
  },
]
