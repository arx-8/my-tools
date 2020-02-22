/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { ButtonWithLoading } from "src/components/atoms/ButtonWithLoading"
import { useQueryParams } from "src/components/helpers/reactRouterUtils"
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
  const { compress, decompress, isCompressing } = useCompressor<
    UrlStoreValues
  >()
  const queries = useQueryParams<
    Parameters<typeof DynamicRoutePath.Diff>["0"]
  >()

  // decompress 完了までにサンプルが見えると不快なため、ブックマーク遷移の場合は空表示にする
  const hasQueries = queries.v != null
  const [aTextInit, setATextInit] = useState(hasQueries ? "" : exampleA)
  const [bTextInit, setBTextInit] = useState(hasQueries ? "" : exampleB)
  // パフォーマンスチューニングのため分けてる
  const [aText, setAText] = useState(hasQueries ? "" : exampleA)
  const [bText, setBText] = useState(hasQueries ? "" : exampleB)

  // diff options
  const [diffMode, setDiffMode] = useState<DiffMode>("Chars")
  const [diffOptions, setDiffOptions] = useState<DiffOptions>({
    ignoreCase: false,
  })

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
        defaultIcon={<BookmarkBorderIcon />}
        isLoading={isCompressing}
        loadingIconProps={{
          size: 24,
        }}
        onClick={onCompress}
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

      <div css={main}>
        <div css={[mainChildren, diffSrc1]}>
          <RichTextarea
            initialValue={aTextInit}
            onChange={(value) => setAText(value)}
          />
        </div>
        <div css={[mainChildren, diffSrc2]}>
          <RichTextarea
            initialValue={bTextInit}
            onChange={(value) => setBText(value)}
          />
        </div>
        <DiffResult
          diffs={diff(aText, bText, diffMode, diffOptions)}
          exCss={[mainChildren, diffResult]}
        />
      </div>
    </Layout>
  )
}

const main = css`
  display: grid;
  gap: 4px;
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

const diffResult = css`
  border: 1px solid;
  padding-left: ${numberAreaWidth};
`
