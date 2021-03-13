/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx, SerializedStyles } from "@emotion/react"
import { TextareaAutosize } from "@material-ui/core"
import zIndex from "@material-ui/core/styles/zIndex"
import DeleteIcon from "@material-ui/icons/Delete"
import throttle from "lodash/throttle"
import React, { useEffect, useMemo, useState } from "react"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"

type OwnProps = {
  children?: never
  exTextareaCss?: SerializedStyles | SerializedStyles[]
  initialValue: string
  /**
   * 親側に反映すると、再レンダリングが多く発生しうるため、throttleWait 分だけ親側の反映だけ間引く
   * 自身（見た目）の反映は inner state で即時反映する
   */
  onChangeThrottled: (next: string) => void
  throttleWait: number
}

export const RichTextarea: React.FC<OwnProps> = ({
  exTextareaCss,
  initialValue,
  onChangeThrottled,
  throttleWait,
}) => {
  const [innerValue, setInnerValue] = useState(initialValue)

  const _onChangeThrottled = useMemo(
    () => throttle(onChangeThrottled, throttleWait),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [throttleWait]
  )

  useEffect(() => {
    // 初期値が非同期で変更されうるため
    setInnerValue(initialValue)
  }, [initialValue])

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
