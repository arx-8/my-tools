/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import throttle from "lodash/throttle"
import React, { useCallback, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { ButtonWithLoading } from "src/components/atoms/ButtonWithLoading"
import { useQueryParams } from "src/components/helpers/reactRouterUtils"
import { useActionStatus } from "src/components/helpers/useActionStatus"
import { useCompressor } from "src/components/helpers/useCompressor"
import { RichTextarea } from "src/components/molecules/RichTextarea"
import { numberAreaWidth } from "src/components/molecules/RichTextarea/LineWithNumber"
import { ChooseOptions } from "src/components/pages/Diff/ChooseOptions"
import { DiffResult } from "src/components/pages/Diff/DiffResult"
import {
  UrlStoreValues,
  toStateValues,
  toUrlStoreValues,
} from "src/components/pages/Diff/utils"
import { padT2 } from "src/components/styles/styles"
import { Layout } from "src/components/templates/Layout"
import { DynamicRoutePath } from "src/constants/path"
import { DiffMode, DiffOptions, diff } from "src/utils/diff"

type OwnProps = {
  children?: never
}

const exampleA = `Lorem ipsum dolor sit amet.
Ut enim ad minim veniam.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident.
`
const exampleB = exampleA.replace("l", "1").replace("v", "V")

export const Diff: React.FC<OwnProps> = () => {
  const history = useHistory()
  const queries = useQueryParams<
    Parameters<typeof DynamicRoutePath.Diff>["0"]
  >()

  // compressor と、その loading status
  const { compress, decompress, isCompressing } = useCompressor<
    UrlStoreValues
  >()
  const [compressingStatus] = useActionStatus(isCompressing, 3000)

  // decompress 完了までにサンプルが見えると不快なため、ブックマーク遷移の場合は空表示にする
  const hasQueries = queries.v != null
  const [aTextInit, setATextInit] = useState(hasQueries ? "" : exampleA)
  const [bTextInit, setBTextInit] = useState(hasQueries ? "" : exampleB)
  // パフォーマンスチューニングのため分けてる
  const [aText, setAText] = useState(hasQueries ? "" : exampleA)
  const [bText, setBText] = useState(hasQueries ? "" : exampleB)
  // この値は diff の表示用（入力の表示は Child component state を使っている）
  // そのため、diff への反映だけを間引いて、パフォーマンスを向上させる
  const setATextThrottled = useCallback(throttle(setAText, 500), [])
  const setBTextThrottled = useCallback(throttle(setBText, 500), [])

  // diff options
  const [diffMode, setDiffMode] = useState<DiffMode>("Chars")
  const [diffOptions, setDiffOptions] = useState<DiffOptions>({
    ignoreCase: false,
  })

  // UI
  const [isMaximizeDiffResult, setIsMaximizeDiffResult] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (queries.v == null) {
        return
      }

      const obj = toStateValues(await decompress(queries.v))

      // 子コンポーネント (draft-js) 側で編集再開できるようにするため
      setATextInit(obj.aTextInit)
      setBTextInit(obj.bTextInit)

      // Diff を表示させるため
      setAText(obj.aTextInit)
      setBText(obj.bTextInit)
      setDiffMode(obj.mode)
      setDiffOptions({
        ignoreCase: obj.ignoreCase,
      })
    })()
    // useEffect の無限ループ防止。decompress -> setState は初回のみでいい。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCompress = async (): Promise<void> => {
    history.push(
      DynamicRoutePath.Diff({
        v: await compress(
          toUrlStoreValues({
            aText,
            bText,
            mode: diffMode,
            ...diffOptions,
          })
        ),
      })
    )
  }

  return (
    <Layout>
      <ButtonWithLoading
        disabled={compressingStatus !== "ready"}
        onClick={onCompress}
        status={compressingStatus}
      >
        Generate URL
      </ButtonWithLoading>

      <div css={padT2}></div>
      <ChooseOptions
        diffMode={diffMode}
        diffOptions={diffOptions}
        setDiffMode={setDiffMode}
        setDiffOptions={setDiffOptions}
      />

      <div css={[main, isMaximizeDiffResult ? isMaxMain : isNotMaxMain]}>
        <div css={[mainChildren, diffSrc1, isMaximizeDiffResult && dispNone]}>
          <RichTextarea
            initialValue={aTextInit}
            onChange={(value) => setATextThrottled(value)}
          />
        </div>
        <div css={[mainChildren, diffSrc2, isMaximizeDiffResult && dispNone]}>
          <RichTextarea
            initialValue={bTextInit}
            onChange={(value) => setBTextThrottled(value)}
          />
        </div>
        <div css={[mainChildren, diffResult]}>
          <DiffResult
            diffs={diff(aText, bText, diffMode, diffOptions)}
            isMaximize={isMaximizeDiffResult}
            setMaximize={setIsMaximizeDiffResult}
          />
        </div>
      </div>
    </Layout>
  )
}

const main = css`
  display: grid;
  gap: 4px;
`

const isMaxMain = css`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const isNotMaxMain = css`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const mainChildren = css`
  line-height: initial;
`

const diffSrc1 = css`
  border: 1px solid rgb(250, 128, 114);
`

const diffSrc2 = css`
  border: 1px solid rgb(144, 238, 144);
`

const dispNone = css`
  display: none;
`

const diffResult = css`
  border: 1px solid;
  /* diffSrc の行番号部分と合わせるため */
  padding-left: ${numberAreaWidth};
`
