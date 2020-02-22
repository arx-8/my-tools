/** @jsx jsx */
import { SerializedStyles, css, jsx } from "@emotion/core"
import { Change } from "diff"
import React from "react"

type OwnProps = {
  children?: never
  diffs: Change[]
  exCss?: SerializedStyles | SerializedStyles[]
}

export const DiffResult: React.FC<OwnProps> = ({ diffs, exCss }) => {
  return (
    <pre css={[root, exCss]}>
      {diffs.map((part, index) => {
        const diffCss = part.added
          ? addedCss
          : part.removed
          ? removedCss
          : noDiffCss

        return (
          // 他に unique id がないため
          // eslint-disable-next-line react/no-array-index-key
          <span css={diffCss} key={index}>
            {part.value}
          </span>
        )
      })}
    </pre>
  )
}

const root = css`
  white-space: pre-wrap;
  margin: unset;
  font-family: inherit;
`

const addedCss = css`
  background-color: rgb(144, 238, 144);
`

const removedCss = css`
  background-color: rgb(250, 128, 114);
`

const noDiffCss = css`
  background-color: #ddd;
`
