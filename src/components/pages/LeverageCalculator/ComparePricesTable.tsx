/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Radio, TableSortLabel } from "@material-ui/core"
import { grey } from "@material-ui/core/colors"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ClearIcon from "@material-ui/icons/Clear"
import React from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { PriceOrLoss, ProfitOrLoss } from "src/components/atoms/ProfitOrLoss"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import { tar } from "src/components/styles/styles"
import {
  calcProfitOrLossAsJpy,
  calcTotalProfitOrLossAsJpy,
  getMoneyValue,
  roundMoney,
} from "src/domainLayer/investment/Money"
import {
  calcAveragePrice,
  getHeadOrderStrict,
} from "src/domainLayer/investment/Order"
import { sortBy } from "src/utils/arrayUtils"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
  /** TODO ここ _id にして index を廃止すべき */
  recordIndex: number
}

export const ComparePricesTable: React.FC<Props> = ({ recordIndex }) => {
  const {
    accountBalance,
    records,
    setRecordById,
    usdJpy,
  } = useLeverageCalculator()

  const {
    _id,
    comparePrices,
    comparePricesSortBy,
    isLong,
    orders,
    selectedComparePriceIndex,
  } = records[recordIndex]

  const setRecord = setRecordById(_id)
  const order1st = getHeadOrderStrict(orders)

  const toggleComparePricesSortBy = (): void => {
    setRecord((draft) => {
      if (draft.comparePricesSortBy == null) {
        draft.comparePricesSortBy = {
          direction: "asc",
          target: "targetUnitPrice",
        }
        draft.comparePrices = sortBy(draft.comparePrices, "asc")
      } else {
        const nextDir =
          draft.comparePricesSortBy.direction === "asc" ? "desc" : "asc"
        draft.comparePricesSortBy = {
          direction: nextDir,
          target: draft.comparePricesSortBy.target,
        }
        draft.comparePrices = sortBy(draft.comparePrices, nextDir)
      }
    })
  }

  const calcAccountBalanceWithTotalProfitOrLossAsJpy = (
    comparePrice: number
  ): number => {
    return orders
      .filter((o) => o.selected)
      .reduce((acc, curr) => {
        return (acc += getMoneyValue(
          calcProfitOrLossAsJpy(
            comparePrice,
            curr.targetUnitPrice,
            curr.orderQuantity,
            isLong,
            usdJpy
          )
        ))
      }, accountBalance.asJpy)
  }

  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell css={parentCol1}>価格比較</TableCell>
          <TableCell>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    {/* 想定目標選択列 */}
                  </TableCell>
                  <TableCell css={col1}>
                    <TableSortLabel
                      active={comparePricesSortBy?.target === "targetUnitPrice"}
                      direction={comparePricesSortBy?.direction}
                      onClick={toggleComparePricesSortBy}
                    >
                      対象単価 ({order1st.targetUnitPrice.currency})
                    </TableSortLabel>
                  </TableCell>
                  <TableCell css={col2}>損益 (JPY)</TableCell>
                  <TableCell css={col3}>証拠金残高 (JPY)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {comparePrices.map((p, index) => {
                  return (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableRow key={index}>
                      {/* 想定目標選択列 */}
                      <TableCell padding="checkbox">
                        <Radio
                          checked={selectedComparePriceIndex === index}
                          color="primary"
                          onChange={(e) =>
                            setRecord((draft) => {
                              if (e.target.checked) {
                                draft.selectedComparePriceIndex = index
                              }
                            })
                          }
                        />
                      </TableCell>
                      {/* 対象単価 */}
                      <TableCell css={tar}>
                        <FastNumberField
                          arrowInputStep={calc10PerStep(p)}
                          onChangeValue={(v) => {
                            setRecord((draft) => {
                              draft.comparePrices[index] = v ?? 0
                            })
                          }}
                          value={p}
                        />
                      </TableCell>

                      {/* 損益 */}
                      <TableCell css={tar}>
                        <div css={calcCell}>
                          <ProfitOrLoss
                            value={calcTotalProfitOrLossAsJpy(
                              p,
                              orders,
                              isLong,
                              usdJpy
                            )}
                          />
                        </div>
                      </TableCell>

                      {/* 証拠金残高 */}
                      <TableCell css={tar}>
                        <div css={calcCell}>
                          <PriceOrLoss
                            value={calcAccountBalanceWithTotalProfitOrLossAsJpy(
                              p
                            )}
                          />
                        </div>
                      </TableCell>

                      {/* 操作 */}
                      <TableCell>
                        <IconButtonGA
                          gaData={{
                            dataEventAction: "delete compare price",
                            dataEventCategory: "LeverageCalculator",
                            dataOn: "click",
                          }}
                          onClick={() => {
                            setRecord((draft) => {
                              draft.comparePrices = draft.comparePrices.filter(
                                (_, draftIdx) => draftIdx !== index
                              )
                            })
                          }}
                        >
                          <ClearIcon />
                        </IconButtonGA>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <ButtonGA
              gaData={{
                dataEventAction: "add compare price",
                dataEventCategory: "LeverageCalculator",
                dataOn: "click",
              }}
              onClick={() =>
                setRecord((draft) => {
                  // デフォルト値は、入力値の基準になるよう +-0 値（の近似値）にする
                  draft.comparePrices.push(
                    getMoneyValue(
                      roundMoney(
                        calcAveragePrice(orders.filter((o) => o.selected))
                      )
                    )
                  )
                })
              }
              size="small"
              variant="contained"
            >
              追加
            </ButtonGA>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

const parentCol1 = css`
  width: 88px;
`

const col1 = css`
  width: 144px;
`

const col2 = css`
  width: 112px;
`

const col3 = css`
  width: 128px;
`

const calcCell = css`
  background-color: ${grey.A100}!important;
`
