import csvTools from "csv-tools"
import { CastAny } from "src/types/utils"

const TABLE_SEPARATOR = /^\+[-|+]+\+$/
const BAR_OF_HEAD = /^\|/
const BAR_OF_TAIL = /\|$/
const BAR_OF_MIDDLE = /\s*\|\s*/g

export const mysqlTableToCsv = (mysqlTableStr: string): string => {
  try {
    validateMysqlTableValue(mysqlTableStr)
  } catch (error) {
    return "Error!"
  }

  // convert
  const result = mysqlTableStr
    .trim()
    .split("\n")
    .filter((line) => line.match(TABLE_SEPARATOR) == null)
    .map((line) =>
      line
        .replace(BAR_OF_HEAD, "")
        .replace(BAR_OF_TAIL, "")
        .replace(BAR_OF_MIDDLE, ",")
        .trim()
    )
    .join("\n")
  return result
}

const validateMysqlTableValue = (value: string): void => {
  const src = value.trim().split("\n")
  if (src.length < 5) {
    throw new Error(`Simple domain error: Too short. value=${value}`)
  }

  const noSeparators = src.filter((line) => line.match(TABLE_SEPARATOR) == null)
  if (src.length - noSeparators.length !== 3) {
    throw new Error(
      `Simple domain error: Unexpected mysql table value. value=${value}`
    )
  }
}

export const mysqlTableToJson = (mysqlTableStr: string): string => {
  try {
    validateMysqlTableValue(mysqlTableStr)
  } catch (error) {
    return "Error!"
  }

  return JSON.stringify(
    csvToObject(mysqlTableToCsv(mysqlTableStr)),
    undefined,
    "  "
  )
}

export const csvToObject = <
  T extends Record<string, unknown> = Record<string, CastAny>
>(
  csvStr: string
): T => {
  return csvTools.toJSON(csvStr.trim())
}
