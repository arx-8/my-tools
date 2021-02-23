/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react"
import { Paper } from "@material-ui/core"
import { grey } from "@material-ui/core/colors"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import {
  LeverageCalculatorProvider,
  useLeverageCalculator,
} from "src/components/helpers/LeverageCalculatorContext"
import { CalculatorRecords } from "src/components/pages/LeverageCalculator/CalculatorRecords"
import { CommonInputs } from "src/components/pages/LeverageCalculator/CommonInputs"
import { padT, padT2 } from "src/components/styles/styles"
import { Layout } from "src/components/templates/Layout"

type Props = {
  children?: never
}

export const LeverageCalculator: React.FC<Props> = () => {
  return (
    <LeverageCalculatorProvider>
      <Subscriber />
    </LeverageCalculatorProvider>
  )
}

const Subscriber: React.FC<Props> = () => {
  const { addRecord } = useLeverageCalculator()

  return (
    <Layout exCss={root}>
      <CommonInputs />

      <div css={padT2}></div>
      <Paper css={records}>
        <CalculatorRecords />
      </Paper>

      <div css={padT}>
        <ButtonGA
          gaData={{
            dataEventAction: "add record",
            dataEventCategory: "LeverageCalculator",
            dataOn: "click",
          }}
          onClick={addRecord}
          size="small"
          variant="contained"
        >
          追加
        </ButtonGA>
      </div>
    </Layout>
  )
}

const root = css`
  /* MUI に border-collapse: collapse; があるため、tr には border が効かない */
  & td {
    border-bottom: 1px solid ${grey["500"]};
  }
`

const records = css`
  padding: 8px;
`
