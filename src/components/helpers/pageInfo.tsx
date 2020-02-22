/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { DiffIcon } from "src/components/atoms/DiffIcon"
import { DynamicRoutePath } from "src/constants/path"

const icon = css`
  height: 32px;
`

export const pageInfo = [
  {
    icon: <DiffIcon exCss={icon} />,
    linkTo: DynamicRoutePath.Diff(),
    title: "Bookmarkable Diff",
  },
]
