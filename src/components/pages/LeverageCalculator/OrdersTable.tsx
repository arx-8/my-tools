/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Checkbox, TableSortLabel } from "@material-ui/core"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import ClearIcon from "@material-ui/icons/Clear"
import orderBy from "lodash/orderBy"
import React, { useState } from "react"
import { ButtonGA } from "src/components/atoms/ButtonGA"
import { FastNumberField } from "src/components/atoms/FastNumberField"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import {
  CalculatorRecord,
  useLeverageCalculator,
} from "src/components/helpers/LeverageCalculatorContext"
import { getMoneyValue, setMoneyValue } from "src/domainLayer/investment/Money"
import { getWholeSelectStatus } from "src/domainLayer/investment/Order"
import { SortDirection } from "src/utils/arrayUtils"
import { calc10PerStep } from "src/utils/numberUtils"

type Props = {
  children?: never
  /** TODO ここ _id にして index を廃止すべき */
  recordIndex: number
}

export const OrdersTable: React.FC<Props> = ({ recordIndex }) => {
  const [direction, setDirection] = useState<SortDirection | undefined>(
    undefined
  )

  const { records, setRecordById } = useLeverageCalculator()
  const { _id, orders } = records[recordIndex]

  const setRecord = setRecordById(_id)

  const toggleDirection = (): void => {
    const next = direction === "asc" ? "desc" : "asc"
    setDirection(next)
    setRecord((draft) => {
      draft.orders = orderBy(
        draft.orders,
        (o) => getMoneyValue(o.targetUnitPrice),
        next
      )
    })
  }

  const wholeSelectStatus = getWholeSelectStatus(orders)

  return (
    <div>
      <ButtonGA
        gaData={{
          dataEventAction: "add order",
          dataEventCategory: "LeverageCalculator",
          dataOn: "click",
        }}
        onClick={() =>
          setRecord((draft) => {
            // 近い価格で発注することが多いはずなので、初期値は直近と同じ価格
            draft.orders.push(draft.orders[draft.orders.length - 1])
          })
        }
        size="small"
        variant="contained"
      >
        追加
      </ButtonGA>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              {/* 選択列 */}
              <Checkbox
                checked={wholeSelectStatus === "all-selected"}
                color="primary"
                indeterminate={wholeSelectStatus === "indeterminate"}
                inputProps={{ "aria-label": "select all" }}
                onChange={(e) => {
                  setRecord((draft) => {
                    draft.orders.forEach((o) => (o.selected = e.target.checked))
                  })
                }}
              />
            </TableCell>
            <TableCell css={col1}>
              <TableSortLabel
                active={direction != null}
                direction={direction}
                onClick={toggleDirection}
              >
                対象単価
              </TableSortLabel>
            </TableCell>
            <TableCell css={col2}>発注数</TableCell>
            <TableCell>{/* 操作列 */}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((o, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={index}>
                {/* 選択列 */}
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={o.selected}
                    color="primary"
                    inputProps={{ "aria-labelledby": `${_id}.orders.${index}` }}
                    onChange={(e) => {
                      setRecord((draft) => {
                        draft.orders[index].selected = e.target.checked
                      })
                    }}
                  />
                </TableCell>

                {/* 対象単価 */}
                <TableCell>
                  <FastNumberField
                    arrowInputStep={calc10PerStep(
                      getMoneyValue(o.targetUnitPrice)
                    )}
                    onChangeValue={(v) => {
                      setRecord((draft) => {
                        draft.orders[index].targetUnitPrice = setMoneyValue(
                          o.targetUnitPrice,
                          v ?? 0
                        )
                      })
                    }}
                    value={getMoneyValue(o.targetUnitPrice)}
                  />
                </TableCell>

                {/* 発注数 */}
                <TableCell>
                  <FastNumberField
                    arrowInputStep={calc10PerStep(o.orderQuantity)}
                    onChangeValue={(v) => {
                      setRecord((draft) => {
                        draft.orders[index].orderQuantity = v ?? 0
                      })
                    }}
                    value={o.orderQuantity}
                  />
                </TableCell>

                {/* 操作 */}
                <TableCell>
                  <IconButtonGA
                    disabled={orders.length <= 1}
                    gaData={{
                      dataEventAction: "delete order",
                      dataEventCategory: "LeverageCalculator",
                      dataOn: "click",
                    }}
                    onClick={() => {
                      setRecord((draft) => {
                        draft.orders = draft.orders.filter(
                          (_, filterIndex) => index !== filterIndex
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
    </div>
  )
}

const col1 = css`
  width: 144px;
`

const col2 = css`
  width: 112px;
`
