/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import LockIcon from "@material-ui/icons/Lock"
import React from "react"
import { ButtonWithLoading } from "src/components/atoms/ButtonWithLoading"
import { ActionStatus } from "src/components/helpers/useActionStatus"
import { RichTextarea } from "src/components/molecules/RichTextarea"
import { numberAreaWidth } from "src/components/molecules/RichTextarea/LineWithNumber"
import { ChooseOptions } from "src/components/pages/Diff/ChooseOptions"
import { DiffResult } from "src/components/pages/Diff/DiffResult"
import { padL, padT2 } from "src/components/styles/styles"
import { Layout } from "src/components/templates/Layout"
import { DiffMode, DiffOptions, diff } from "src/utils/diff"

export type OwnProps = {
  aText: string
  aTextInit: string
  bText: string
  bTextInit: string
  children?: never
  compressingStatus: ActionStatus
  compressingWithEncryptStatus: ActionStatus
  diffMode: DiffMode
  diffOptions: DiffOptions
  onCompress: () => void
  onCompressWithEncrypt: () => void
  setAText: (next: string) => void
  setBText: (next: string) => void
  setDiffMode: (next: DiffMode) => void
  setDiffOptions: (next: DiffOptions) => void
}

export const View: React.FC<OwnProps> = ({
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
}) => {
  return (
    <Layout>
      <ButtonWithLoading
        disabled={
          compressingStatus !== "ready" ||
          compressingWithEncryptStatus === "started" ||
          compressingWithEncryptStatus === "done"
        }
        onClick={onCompress}
        status={compressingStatus}
      >
        Create URL
      </ButtonWithLoading>
      <span css={padL}></span>
      <ButtonWithLoading
        disabled={
          compressingWithEncryptStatus !== "ready" ||
          compressingStatus === "started" ||
          compressingStatus === "done"
        }
        iconMap={{ ready: <LockIcon /> }}
        onClick={onCompressWithEncrypt}
        status={compressingWithEncryptStatus}
      >
        Create URL (with Encrypt)
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
          <RichTextarea initialValue={aTextInit} onChange={setAText} />
        </div>
        <div css={[mainChildren, diffSrc2]}>
          <RichTextarea initialValue={bTextInit} onChange={setBText} />
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
