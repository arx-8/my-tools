/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { FormControlLabel, Paper, Radio } from "@material-ui/core"
import { red } from "@material-ui/core/colors"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableContainer from "@material-ui/core/TableContainer"
import DeleteIcon from "@material-ui/icons/Delete"
import React, { Fragment } from "react"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { FastTextField } from "src/components/atoms/FastTextField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { useLeverageCalculator } from "src/components/helpers/LeverageCalculatorContext"
import { LabeledRow } from "src/components/molecules/LabeledRow"
import { LabeledRowWithRadios } from "src/components/molecules/LabeledRowWithRadios"
import { ComparePricesTable } from "src/components/pages/LeverageCalculator/ComparePricesTable"
import { padT } from "src/components/styles/styles"
import { currenciesLabeled } from "src/domainLayer/investment/Currency"
import { lsValuesLabeled } from "src/domainLayer/investment/LS"
import {
  calcLeverage,
  calcOrderPrice,
  getMoneyValue,
  getMoneyValueAsJpy,
  setMoneyCurrency,
  setMoneyValue,
} from "src/domainLayer/investment/Money"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
}

export const CalculatorRecords: React.FC<Props> = () => {
  const {
    accountBalance,
    records,
    setRecordById,
    usdJpy,
    removeRecordById,
  } = useLeverageCalculator()

  return (
    <Fragment>
      {records.map(
        ({ _id, isLong, name, orderQuantity, targetUnitPrice }, index) => {
          /**
           * setRecordById の id を部分適用
           */
          const setRecord = (
            producer: Parameters<typeof setRecordById>["1"]
          ): void => {
            setRecordById(_id, producer)
          }

          return (
            <Fragment key={_id}>
              <div css={index > 0 && padT} />

              <TableContainer component={Paper}>
                <div css={actions}>
                  <span css={rowNum}>{index + 1}</span>
                  <IconButtonGA
                    aria-label="remove"
                    css={deleteBtn}
                    disabled={records.length <= 1}
                    gaData={{
                      dataEventAction: "remove record",
                      dataEventCategory: "LeverageCalculator",
                      dataOn: "click",
                    }}
                    onClick={() => {
                      if (window.confirm("Delete ?")) {
                        removeRecordById(_id)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButtonGA>
                </div>

                <Table css={tableCss} size="small">
                  <TableBody>
                    <LabeledRow label="名前">
                      <FastTextField
                        onChangeValue={(v) => {
                          setRecord((draft) => {
                            draft.name = v
                          })
                        }}
                        value={name}
                      />
                    </LabeledRow>
                    <LabeledRowWithRadios
                      checked={targetUnitPrice.currency}
                      label="対象単価"
                      onCheckRadio={(v) => {
                        setRecord((draft) => {
                          draft.targetUnitPrice = setMoneyCurrency(
                            draft.targetUnitPrice,
                            v
                          )
                        })
                      }}
                      radioValues={currenciesLabeled}
                    >
                      <FastNumberField
                        arrowInputStep={calc10PerStep(
                          getMoneyValue(targetUnitPrice)
                        )}
                        onChangeValue={(v) => {
                          setRecord((draft) => {
                            draft.targetUnitPrice = setMoneyValue(
                              draft.targetUnitPrice,
                              v ?? 0
                            )
                          })
                        }}
                        value={getMoneyValue(targetUnitPrice)}
                      />
                    </LabeledRowWithRadios>
                    <LabeledRow label="発注数">
                      <FastNumberField
                        arrowInputStep={calc10PerStep(orderQuantity)}
                        onChangeValue={(v) => {
                          setRecord((draft) => {
                            draft.orderQuantity = v ?? 0
                          })
                        }}
                        value={orderQuantity}
                      />
                    </LabeledRow>
                    <LabeledRow label="売買">
                      <div css={radios}>
                        {lsValuesLabeled.map((v) => {
                          return (
                            <FormControlLabel
                              checked={
                                isLong ? v.value === "L" : v.value === "S"
                              }
                              control={<Radio color="primary" />}
                              key={v.value}
                              label={v.label}
                              onClick={() => {
                                setRecord((draft) => {
                                  draft.isLong = v.value === "L"
                                })
                              }}
                            />
                          )
                        })}
                      </div>
                    </LabeledRow>
                    <LabeledRow label="発注価格（￥）">
                      <FastNumberField
                        disabled
                        onChangeValue={() => /** NOP */ undefined}
                        value={getMoneyValueAsJpy(
                          calcOrderPrice(targetUnitPrice, orderQuantity),
                          usdJpy
                        )}
                      />
                    </LabeledRow>
                    <LabeledRow label="レバレッジ">
                      <FastNumberField
                        disabled
                        onChangeValue={() => /** NOP */ undefined}
                        value={calcLeverage(
                          accountBalance,
                          targetUnitPrice,
                          orderQuantity,
                          usdJpy
                        )}
                      />
                    </LabeledRow>
                  </TableBody>
                </Table>

                {/* 上の table の cell と同じ幅だとレイアウトの都合が悪いため、分ける */}
                <ComparePricesTable recordIndex={index} />
              </TableContainer>
            </Fragment>
          )
        }
      )}
    </Fragment>
  )
}

const tableCss = css`
  /* max-width: 800px;
  table-layout: fixed; */

  & td {
    border-bottom: 1px solid rgba(160, 160, 160, 1);
  }
`

const rowNum = css`
  padding: 8px;
`

const actions = css`
  display: flex;
  justify-content: space-between;
`

const deleteBtn = css`
  color: ${red["400"]};
`

// const col1 = css`
//   width: 88px;
// `

// const col2 = css`
//   width: 128px;
// `

// const col3 = css`
//   width: 88px;
// `

const radios = css`
  display: flex;
`
