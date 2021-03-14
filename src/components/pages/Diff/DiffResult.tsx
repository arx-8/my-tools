/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react"
import { green, grey, red } from "@material-ui/core/colors"
import zIndex from "@material-ui/core/styles/zIndex"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit"
import { Change } from "diff"
import React from "react"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"

type OwnProps = {
  children?: never
  diffs: Change[]
  isMaximize: boolean
  setMaximize: (next: boolean) => void
}

export const DiffResult: React.FC<OwnProps> = ({
  diffs,
  isMaximize,
  setMaximize,
}) => {
  return (
    <div css={root}>
      <div css={actions}>
        <IconButtonGA
          aria-label="toggleMaximize"
          css={toggleMaximizeBtn}
          gaData={{
            dataEventAction: "toggleMaximize",
            dataEventCategory: "Bookmarkable Diff",
            dataOn: "click",
          }}
          onClick={() => setMaximize(!isMaximize)}
        >
          {isMaximize ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButtonGA>
      </div>

      <pre css={diffArea}>
        {diffs.map((part, index) => {
          const diffCss = part.added
            ? addedCss
            : part.removed
            ? removedCss
            : noDiffCss

          // 改行の diff の可視化
          // 改行の diff は 0 文字で見えない
          // そのため、空白 1 文字に置換し、それにカラーを付けて可視化する
          const str =
            part.value.trim().length > 0
              ? part.value
              : part.value.replace(/\n/g, " \n")

          return (
            // 他に unique id がないため
            // eslint-disable-next-line react/no-array-index-key
            <span css={diffCss} key={index}>
              {str}
            </span>
          )
        })}
      </pre>
    </div>
  )
}

const root = css`
  position: relative;
`

const actions = css`
  position: absolute;
  right: 0;
  z-index: ${zIndex.mobileStepper};
`

const toggleMaximizeBtn = css`
  padding: 4px !important;
`

const diffArea = css`
  white-space: pre-wrap;
  margin: unset;
  font-family: inherit;
  overflow-wrap: break-word;
`

const addedCss = css`
  background-color: ${green["200"]};
`

const removedCss = css`
  background-color: ${red["200"]};
`

const noDiffCss = css`
  background-color: ${grey["100"]};
`
