/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { green, red } from "@material-ui/core/colors"
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
import { dispNone, padT2 } from "src/components/styles/styles"
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
        gaData={{
          dataEventAction: "Generate URL",
          dataEventCategory: "Bookmarkable Diff",
          dataOn: "click",
        }}
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

      <div css={[main, isMaximizeDiffResult ? whenIsMax : whenIsNotMax]}>
        <div css={[baseDiffText, diffSrc1, isMaximizeDiffResult && dispNone]}>
          <RichTextarea
            initialValue={aTextInit}
            onChange={(value) => setATextThrottled(value)}
          />
        </div>
        <div css={[baseDiffText, diffSrc2, isMaximizeDiffResult && dispNone]}>
          <RichTextarea
            initialValue={bTextInit}
            onChange={(value) => setBTextThrottled(value)}
          />
        </div>
        <div
          css={[
            baseDiffText,
            diffResult,
            isMaximizeDiffResult && diffResultIsMax,
          ]}
        >
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

const whenIsMax = css`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const whenIsNotMax = css`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const baseDiffText = css`
  line-height: initial;
  border: 2px solid;
  border-radius: 4px;
`

const diffSrc1 = css`
  border-color: ${green["700"]};
`

const diffSrc2 = css`
  border-color: ${red["700"]};
`

const diffResult = css`
  /* diffSrc の行番号部分と合わせるため */
  padding-left: ${numberAreaWidth};
`

const diffResultIsMax = css`
  padding-left: 0.3em;
`
