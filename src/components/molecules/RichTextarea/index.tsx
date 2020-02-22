/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { ContentBlock, ContentState, Editor, EditorState } from "draft-js"
import React, { useEffect, useState } from "react"
import { LineWithNumber } from "src/components/molecules/RichTextarea/LineWithNumber"

type OwnProps = {
  children?: never
  initialValue: string
  onChange: (textContent: string) => void
}

export const RichTextarea: React.FC<OwnProps> = ({
  initialValue,
  onChange,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(initialValue))
  )

  useEffect(() => {
    // 初期値が非同期で変更されうるため
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(initialValue))
    )
  }, [initialValue])

  return (
    <div css={root}>
      <Editor
        blockRendererFn={blockRendererFn}
        editorState={editorState}
        onChange={(editorState) => {
          setEditorState(editorState)
          onChange(editorState.getCurrentContent().getPlainText())
        }}
      />
    </div>
  )
}

const root = css``

/**
 * @see https://gist.github.com/schabluk/0e5e938bc30a7833201b605cee4efb4a
 * @see https://gist.github.com/lixiaoyan/79b5740f213b8526d967682f6cd329c0
 */
type BlockRendererFn = (
  contentBlock: ContentBlock
) => {
  component: React.ReactNode
  editable?: boolean
}

const blockRendererFn: BlockRendererFn = () => {
  return { component: LineWithNumber }
}
