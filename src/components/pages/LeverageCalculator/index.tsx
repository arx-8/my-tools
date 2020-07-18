/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Paper } from "@material-ui/core"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import {
  LeverageCalculatorProvider,
  useLeverageCalculator,
} from "src/components/helpers/LeverageCalculatorContext"
import { CalculatorRecords } from "src/components/pages/LeverageCalculator/CalculatorRecords"
import { CommonInputs } from "src/components/pages/LeverageCalculator/CommonInputs"
import { padT2 } from "src/components/styles/styles"
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
    <Layout>
      <CommonInputs />

      <div css={padT2}></div>
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

      <Paper>
        <CalculatorRecords />
      </Paper>
    </Layout>
  )
}
