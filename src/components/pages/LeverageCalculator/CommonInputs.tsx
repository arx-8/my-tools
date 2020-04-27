/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from "@material-ui/core"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import { LabeledRow } from "src/components/molecules/LabeledRow"
import { getMoneyValue } from "src/domainLayer/investment/Money"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
}

export const CommonInputs: React.FC<Props> = () => {
  const {
    accountBalance,
    fetchUsdJpy,
    isFetchingUsdJpy,
    setAccountBalanceValue,
    setUsdJpy,
    usdJpy,
  } = useLeverageCalculator()

  return (
    <TableContainer component={Paper}>
      <Table css={tableCss} size="small">
        <TableBody>
          <LabeledRow label="証拠金残高 (JPY)">
            <FastNumberField
              arrowInputStep={calc10PerStep(getMoneyValue(accountBalance))}
              onChangeValue={(v) => setAccountBalanceValue(v ?? 0)}
              value={getMoneyValue(accountBalance)}
            />
          </LabeledRow>

          <TableRow>
            <TableCell css={col1}>USD/JPY</TableCell>
            <TableCell css={col2}>
              <FastNumberField
                arrowInputStep={calc10PerStep(usdJpy)}
                onChangeValue={(v) => setUsdJpy(v ?? 0)}
                value={usdJpy}
              />
            </TableCell>
            <TableCell css={col3}>
              {isFetchingUsdJpy ? (
                <CircularProgress size={24} />
              ) : (
                <ButtonGA
                  color="primary"
                  gaData={{
                    dataEventAction: "refetch usdJpy",
                    dataEventCategory: "LeverageCalculator",
                    dataOn: "click",
                  }}
                  onClick={fetchUsdJpy}
                  size="small"
                  variant="contained"
                >
                  更新
                </ButtonGA>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const tableCss = css`
  /* max-width: 800px;
  table-layout: fixed; */

  & td {
    border-bottom: 1px solid rgba(160, 160, 160, 1);
  }
`

const col1 = css`
  width: 88px;
`

const col2 = css`
  width: 128px;
`

const col3 = css`
  width: 88px;
`
