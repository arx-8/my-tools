/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useQueryParams } from "src/components/helpers/reactRouterUtils"
import { useCompressor } from "src/components/helpers/useCompressor"
import { ChooseOptions } from "src/components/pages/Diff/ChooseOptions"
import {
  UrlStoreValues,
  toStateValues,
  toUrlStoreValues,
} from "src/components/pages/Diff/utils"
import { Layout } from "src/components/templates/Layout"
import { DynamicRoutePath } from "src/constants/path"
import { DiffMode, DiffOptions, diff } from "src/utils/diff"

type OwnProps = {
  children?: never
}

const example = `Lorem ipsum dolor sit amet.
Ut enim ad minim veniam.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident.
`

export const Diff: React.FC<OwnProps> = () => {
  const history = useHistory()
  const { compress, decompress } = useCompressor<UrlStoreValues>()
  const queries = useQueryParams<
    Parameters<typeof DynamicRoutePath.Diff>["0"]
  >()

  // decompress 完了までにサンプルが見えると不快なため、ブックマーク遷移の場合は空表示にする
  const hasQueries = queries.v != null
  const [aText, setAText] = useState(hasQueries ? "" : example)
  const [bText, setBText] = useState(
    hasQueries ? "" : example.replace("l", "1").replace("v", "V")
  )
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
      setAText(obj.aText)
      setBText(obj.bText)
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
      <Typography variant="h4" gutterBottom>
        Bookmarkable Diff
      </Typography>

      <button onClick={onCompress}>Generate</button>

      <ChooseOptions
        diffMode={diffMode}
        setDiffMode={setDiffMode}
        diffOptions={diffOptions}
        setDiffOptions={setDiffOptions}
      />

      <div>
        <textarea
          style={{ width: "100%" }}
          rows={10}
          onChange={(e) => setAText(e.target.value)}
          value={aText}
        />
      </div>
      <div>
        <textarea
          style={{ width: "100%" }}
          rows={10}
          onChange={(e) => setBText(e.target.value)}
          value={bText}
        />
      </div>
      <pre>
        {diff(aText, bText, diffMode, diffOptions).map((part, index) => {
          const diffCss = part.added
            ? addedCss
            : part.removed
            ? removedCss
            : noDiffCss

          return (
            // 他に unique id がないため
            // eslint-disable-next-line react/no-array-index-key
            <span key={index} css={diffCss}>
              {part.value}
            </span>
          )
        })}
      </pre>
    </Layout>
  )
}

const addedCss = css`
  background-color: lightgreen;
`

const removedCss = css`
  background-color: salmon;
`

const noDiffCss = css`
  background-color: lightgrey;
`
