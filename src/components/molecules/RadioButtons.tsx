/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/core"
import { FormControlLabel, RadioGroup } from "@material-ui/core"
import Radio from "@material-ui/core/Radio"
import { ReactElement } from "react"
import { CastAny } from "src/types/utils"

type OwnProps<TValue extends string> = {
  children?: never
  exCss?: InterpolationWithTheme<CastAny>
  onChange: (value: TValue) => void
  selectedValue: TValue
  values: readonly TValue[]
}

export const RadioButtons = <TValue extends string>({
  onChange,
  selectedValue,
  values,
  exCss,
}: OwnProps<TValue>): ReactElement => {
  return (
    <RadioGroup
      css={exCss}
      value={selectedValue}
      onChange={(e) => {
        onChange(e.target.value as TValue)
      }}
    >
      {values.map((v) => {
        return (
          <FormControlLabel key={v} value={v} control={<Radio />} label={v} />
        )
      })}
    </RadioGroup>
  )
}
