/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react"
import { FormControlLabel, Radio } from "@material-ui/core"
import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import { ReactChild, ReactElement } from "react"
import { LabeledValue } from "src/types/utils"

type Props<T extends string | number> = {
  checked: T
  children: ReactChild | ReactChild[]
  label: string
  onCheckRadio: (next: T) => void
  radioValues: LabeledValue<T>[]
}

export const LabeledRowWithRadios = <T extends string | number>({
  checked,
  children,
  label,
  onCheckRadio,
  radioValues,
}: Props<T>): ReactElement => {
  return (
    <TableRow>
      <TableCell>
        <div>{label}</div>
        <div css={radios}>
          {radioValues.map((v) => {
            return (
              <FormControlLabel
                checked={v.value === checked}
                control={<Radio color="primary" css={radioBtn} />}
                key={v.value}
                label={v.label}
                onClick={() => onCheckRadio(v.value)}
              />
            )
          })}
        </div>
      </TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  )
}

const radios = css`
  display: flex;
`

const radioBtn = css`
  padding: 4px;
`
