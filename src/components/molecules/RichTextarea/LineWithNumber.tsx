/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { ContentBlock, ContentState, EditorBlock } from "draft-js"
import React from "react"

type OwnProps = {
  block: ContentBlock
  children?: never
  contentState: ContentState
}

export const numberAreaWidth = "1.5em"

export const LineWithNumber: React.FC<OwnProps> = (props) => {
  const { block, contentState } = props
  const lineNumber =
    contentState
      .getBlockMap()
      .toList()
      .findIndex((item) => item?.getKey() === block.getKey()) + 1

  return (
    <div css={root} data-line-number={lineNumber}>
      <div css={lineText}>
        <EditorBlock {...props} />
      </div>
    </div>
  )
}

const root = css`
  & {
    position: relative;
  }

  &::before {
    content: attr(data-line-number);
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.5;
    font-size: smaller;
  }
`

const lineText = css`
  margin-left: ${numberAreaWidth};
`
