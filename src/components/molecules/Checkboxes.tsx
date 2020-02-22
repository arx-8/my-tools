/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Checkbox, FormControlLabel } from "@material-ui/core"
import { Fragment, ReactElement } from "react"

type LabeledValue<TValue extends string> = {
  label: string
  value: TValue
}

type OwnProps<TValue extends string> = {
  children?: never
  onChange: (nextValues: TValue[]) => void
  selectedValues: TValue[]
  values: readonly LabeledValue<TValue>[]
}

export const Checkboxes = <TValue extends string>({
  onChange,
  selectedValues,
  values,
}: OwnProps<TValue>): ReactElement => {
  return (
    <Fragment>
      {values.map(({ label, value }) => {
        const checked = selectedValues.includes(value)
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={() => {
                  if (checked) {
                    onChange(selectedValues.filter((v) => v !== value))
                  } else {
                    onChange([...selectedValues, value])
                  }
                }}
              />
            }
            key={value}
            label={label}
          />
        )
      })}
    </Fragment>
  )
}
