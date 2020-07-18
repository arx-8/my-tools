/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from "@material-ui/core"
import { grey } from "@material-ui/core/colors"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { PriceOrLoss, ProfitOrLoss } from "src/components/atoms/ProfitOrLoss"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import { LabeledRow } from "src/components/molecules/LabeledRow"
import { tar } from "src/components/styles/styles"
import { getMoneyValue } from "src/domainLayer/investment/Money"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
}

export const CommonInputs: React.FC<Props> = () => {
  const {
    accountBalance,
    allTotalAccountBalanceWithTotalProfitOrLoss,
    allTotalLeverage,
    allTotalProfitOrLoss,
    fetchUsdJpy,
    isFetchingUsdJpy,
    setAccountBalanceValue,
    setUsdJpy,
    usdJpy,
  } = useLeverageCalculator()

  return (
    <TableContainer component={Paper}>
      <Table size="small">
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

          <LabeledRow label="レバレッジ">
            <div css={[calcCell, tar]}>
              <PriceOrLoss value={allTotalLeverage} />
            </div>
          </LabeledRow>
          <LabeledRow label="全合計価格比較損益 (JPY)">
            <div css={[calcCell, tar]}>
              <ProfitOrLoss value={allTotalProfitOrLoss} />
            </div>
          </LabeledRow>
          <LabeledRow label="全合計証拠金残高 (JPY)">
            <div css={[calcCell, tar]}>
              <PriceOrLoss
                value={allTotalAccountBalanceWithTotalProfitOrLoss}
              />
            </div>
          </LabeledRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const col1 = css`
  width: 88px;
`

const col2 = css`
  width: 128px;
`

const col3 = css`
  width: 88px;
`

const calcCell = css`
  background-color: ${grey.A100}!important;
  width: 196px;
`
