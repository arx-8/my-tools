/** @jsx jsx */
import { SerializedStyles, css, jsx } from "@emotion/core"
import { TextareaAutosize } from "@material-ui/core"
import zIndex from "@material-ui/core/styles/zIndex"
import DeleteIcon from "@material-ui/icons/Delete"
import throttle from "lodash/throttle"
import React, { useCallback, useState } from "react"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"

type OwnProps = {
  children?: never
  exTextareaCss?: SerializedStyles | SerializedStyles[]
  /**
   * 親側に反映すると、再レンダリングが多く発生しうるため、throttleWait 分だけ親側の反映だけ間引く
   * 自身（見た目）の反映は inner state で即時反映する
   */
  onChangeThrottled: (next: string) => void
  throttleWait: number
  value: string
}

export const RichTextarea: React.FC<OwnProps> = ({
  exTextareaCss,
  onChangeThrottled,
  value,
  throttleWait,
}) => {
  const [innerValue, setInnerValue] = useState(value)

  const _onChangeThrottled = useCallback(
    throttle(onChangeThrottled, throttleWait),
    []
  )

  return (
    <div css={root}>
      <div css={actions}>
        <IconButtonGA
          aria-label="clear"
          css={clearBtn}
          gaData={{
            dataEventAction: "clear",
            dataEventCategory: "Bookmarkable Diff",
            dataOn: "click",
          }}
          onClick={() => {
            setInnerValue("")
            // clear だけは即時反映された方が見栄えがいいため
            onChangeThrottled("")
          }}
          tabIndex={-1}
        >
          <DeleteIcon />
        </IconButtonGA>
      </div>

      <TextareaAutosize
        css={[textareaCss, exTextareaCss]}
        onChange={(e) => {
          setInnerValue(e.target.value)
          _onChangeThrottled(e.target.value)
        }}
        rowsMin={3}
        value={innerValue}
      />
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

const clearBtn = css`
  padding: 4px !important;
`

const textareaCss = css`
  width: 100%;
`
