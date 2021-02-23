/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react"
import { TextareaAutosize } from "@material-ui/core"
import AssignmentIcon from "@material-ui/icons/Assignment"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import React, { useState } from "react"
import { useLocalStorage } from "react-use"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { padT } from "src/components/styles/styles"
import { Layout } from "src/components/templates/Layout"
import { APP_VER } from "src/constants/app"
import { mysqlTableToCsv, mysqlTableToJson } from "src/utils/mysqlUtils"

type OwnProps = {
  children?: never
}

type ConvertType = "csv" | "json"

const exampleTable = `\
+----+--------------------+-------------+------+
| id | title              | genre       | year |
+----+--------------------+-------------+------+
|  1 | Star Wars          | SF          | 2015 |
|  2 | Back To The Future | SF          | 1985 |
|  3 | City Of God        | Non Fiction | 2003 |
|  4 | A Clockwork Orange | Thriller    | 1971 |
|  5 | Home Alone         | Comedy      | 1990 |
+----+--------------------+-------------+------+
`

export const MysqlTableToX: React.FC<OwnProps> = () => {
  const [mysqlTableValue, setMysqlTableValue] = useState(exampleTable)
  const [convertType, setConvertType] = useLocalStorage<ConvertType>(
    `${APP_VER}/MysqlTableToX`,
    "csv"
  )

  const converted =
    convertType === "csv"
      ? mysqlTableToCsv(mysqlTableValue)
      : mysqlTableToJson(mysqlTableValue)

  return (
    <Layout>
      <div css={root}>
        <TextareaAutosize
          css={textareaCss}
          onChange={(e) => {
            setMysqlTableValue(e.target.value)
          }}
          onFocus={(e) => e.target.select()}
          rowsMin={5}
          value={mysqlTableValue}
        />

        <div css={[padT, actions]}>
          <ToggleButtonGroup
            exclusive
            onChange={(_e, value) => {
              setConvertType(value)
            }}
            value={convertType}
          >
            <ToggleButton aria-label="centered" value="csv">
              CSV
            </ToggleButton>
            <ToggleButton aria-label="left aligned" value="json">
              JSON
            </ToggleButton>
          </ToggleButtonGroup>

          <IconButtonGA
            aria-label="copy to clipboard"
            gaData={{
              dataEventAction: "copyToClipboard",
              dataEventCategory: "MySQL table to X",
              dataOn: "click",
            }}
            onClick={() => {
              navigator.clipboard.writeText(converted)
            }}
          >
            <AssignmentIcon />
          </IconButtonGA>
        </div>

        <div css={padT}></div>
        <TextareaAutosize
          css={[textareaCss, readOnly]}
          onFocus={(e) => e.target.select()}
          readOnly
          rowsMin={5}
          value={converted}
        />
      </div>
    </Layout>
  )
}

const root = css``

const textareaCss = css`
  width: 100%;
`

const readOnly = css`
  cursor: default;
  color: rgb(84, 84, 84);
  background-color: rgb(235, 235, 228);
`

const actions = css`
  display: flex;
  justify-content: space-between;
`
