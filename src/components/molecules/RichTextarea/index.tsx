/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import IconButton from "@material-ui/core/IconButton"
import zIndex from "@material-ui/core/styles/zIndex"
import DeleteIcon from "@material-ui/icons/Delete"
import { ContentBlock, ContentState, Editor, EditorState } from "draft-js"
import React, { useEffect, useState } from "react"
import { LineWithNumber } from "src/components/molecules/RichTextarea/LineWithNumber"

type OwnProps = {
  children?: never
  initialValue: string
  onChange: (textContent: string) => void
}

/**
 * Memo: `Select all on focus` is not working...
 * https://github.com/facebook/draft-js/issues/1386#issuecomment-413752604
 */
export const RichTextarea: React.FC<OwnProps> = ({
  initialValue,
  onChange,
}) => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(initialValue))
  )
  const _onChange = (next: EditorState): void => {
    setEditorState(next)
    // Set raw text to parent
    onChange(next.getCurrentContent().getPlainText())
  }

  useEffect(() => {
    // 初期値が非同期で変更されうるため
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(initialValue))
    )
  }, [initialValue])

  const onClear = (): void => {
    // undo 可能にするため、undo stack に空を積む
    const next = EditorState.push(
      editorState,
      EditorState.createEmpty().getCurrentContent(),
      "redo"
    )
    _onChange(next)
  }

  return (
    <div css={root}>
      <div css={actions}>
        <IconButton aria-label="clear" css={clearBtn} onClick={onClear}>
          <DeleteIcon />
        </IconButton>
      </div>

      <Editor
        blockRendererFn={blockRendererFn}
        editorState={editorState}
        onChange={_onChange}
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
