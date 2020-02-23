import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useQueryParams } from "src/components/helpers/reactRouterUtils"
import { useActionStatus } from "src/components/helpers/useActionStatus"
import { useCompressor } from "src/components/helpers/useCompressor"
import { useCompressorWithCrypto } from "src/components/helpers/useCompressorWithCrypto"
import {
  UrlStoreValues,
  toStateValues,
  toUrlStoreValues,
} from "src/components/pages/Diff/utils"
import { View, OwnProps as ViewOwnProps } from "src/components/pages/Diff/View"
import { DynamicRoutePath } from "src/constants/path"
import { CompressedString } from "src/utils/compress"
import { DiffMode, DiffOptions } from "src/utils/diff"

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

  // with encrypt
  const {
    compressWithEnc,
    decompressWithEnc,
    isCompressingWithEnc,
  } = useCompressorWithCrypto<UrlStoreValues>()
  const [compressingWithEncryptStatus] = useActionStatus(
    isCompressingWithEnc,
    3000
  )

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

  const onCompressWithEncrypt = async (): Promise<void> => {
    const password = "TODO password"

    history.push(
      DynamicRoutePath.Diff({
        e: "y",
        v: await compressWithEnc(
          toUrlStoreValues({
            aText,
            bText,
            mode: diffMode,
            ...diffOptions,
          }),
          password
        ),
      })
    )
  }

  // 初期化処理(useEffect)の違いと、共通処理の分離のため
  const baseProps = {
    aText,
    aTextInit,
    bText,
    bTextInit,
    compressingStatus,
    compressingWithEncryptStatus,
    diffMode,
    diffOptions,
    onCompress,
    onCompressWithEncrypt,
    setAText,
    setBText,
    setDiffMode,
    setDiffOptions,
  }
  if (queries.e == null && queries.v != null) {
    return (
      <DiffFromBookmark
        {...baseProps}
        decompress={decompress}
        queries={{ v: queries.v }}
        setATextInit={setATextInit}
        setBTextInit={setBTextInit}
      />
    )
  }
  if (queries.e === "y" && queries.v != null) {
    return (
      <DiffFromBookmarkWithEncrypt
        {...baseProps}
        decompressWithEnc={decompressWithEnc}
        queries={{ v: queries.v }}
        setATextInit={setATextInit}
        setBTextInit={setBTextInit}
      />
    )
  }

  return <DiffInit {...baseProps} />
}

/**
 * 初期表示
 */
const DiffInit: React.FC<ViewOwnProps> = (props) => {
  return <View {...props} />
}

type PropsDiffFromBookmarkBase = {
  queries: { v: CompressedString }
  setATextInit: (next: string) => void
  setBTextInit: (next: string) => void
} & ViewOwnProps

type PropsDiffFromBookmark = {
  decompress: (dst: CompressedString) => Promise<UrlStoreValues>
} & PropsDiffFromBookmarkBase

/**
 * ブクマ遷移
 */
const DiffFromBookmark: React.FC<PropsDiffFromBookmark> = ({
  decompress,
  queries,
  setAText,
  setATextInit,
  setBText,
  setBTextInit,
  setDiffMode,
  setDiffOptions,
  ...rest
}) => {
  useEffect(() => {
    ;(async () => {
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

  return (
    <View
      {...rest}
      setAText={setAText}
      setBText={setBText}
      setDiffMode={setDiffMode}
      setDiffOptions={setDiffOptions}
    />
  )
}

type PropsDiffFromBookmarkWithEncrypt = {
  decompressWithEnc: (
    dst: CompressedString,
    password: string
  ) => Promise<UrlStoreValues>
} & PropsDiffFromBookmarkBase

/**
 * ブクマ & 暗号化遷移
 */
const DiffFromBookmarkWithEncrypt: React.FC<PropsDiffFromBookmarkWithEncrypt> = ({
  decompressWithEnc,
  queries,
  setAText,
  setATextInit,
  setBText,
  setBTextInit,
  setDiffMode,
  setDiffOptions,
  ...rest
}) => {
  useEffect(() => {
    ;(async () => {
      const obj = toStateValues(
        await decompressWithEnc(queries.v, "TODO password")
      )

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

  return (
    <View
      {...rest}
      setAText={setAText}
      setBText={setBText}
      setDiffMode={setDiffMode}
      setDiffOptions={setDiffOptions}
    />
  )
}
