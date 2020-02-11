/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import React from "react"
import { Layout } from "src/components/templates/Layout"

type OwnProps = {
  children?: never
}

export const Diff: React.FC<OwnProps> = () => {
  return (
    <Layout>
      <div css={root}>Diff page</div>
    </Layout>
  )
}

const root = css``
