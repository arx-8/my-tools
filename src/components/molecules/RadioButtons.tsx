/** @jsxRuntime classic */
/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/react"
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
  exCss,
  onChange,
  selectedValue,
  values,
}: OwnProps<TValue>): ReactElement => {
  return (
    <RadioGroup
      css={exCss}
      onChange={(e) => {
        onChange(e.target.value as TValue)
      }}
      value={selectedValue}
    >
      {values.map((v) => {
        return (
          <FormControlLabel control={<Radio />} key={v} label={v} value={v} />
        )
      })}
    </RadioGroup>
  )
}
