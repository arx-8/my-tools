/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Typography } from "@material-ui/core"
import React from "react"
import { Checkboxes } from "src/components/molecules/Checkboxes"
import { RadioButtons } from "src/components/molecules/RadioButtons"
import {
  DiffMode,
  DiffModeValues,
  DiffOptionKey,
  DiffOptionKeys,
  DiffOptions,
} from "src/utils/diff"

type OwnProps = {
  children?: never
  diffMode: DiffMode
  diffOptions: DiffOptions
  setDiffMode: (v: DiffMode) => void
  setDiffOptions: (v: DiffOptions) => void
}

export const ChooseOptions: React.FC<OwnProps> = ({
  diffMode,
  diffOptions,
  setDiffMode,
  setDiffOptions,
}) => {
  return (
    <div css={root}>
      <Typography variant="h6">Diff mode</Typography>
      <div>
        <RadioButtons
          exCss={radios}
          onChange={setDiffMode}
          selectedValue={diffMode}
          values={DiffModeValues}
        />
      </div>
      <div>
        <Checkboxes
          onChange={(nextValues) => {
            setDiffOptions(
              DiffOptionKeys.reduce((acc, curr) => {
                acc[curr] = nextValues.includes(curr)
                return acc
              }, {} as DiffOptions)
            )
          }}
          selectedValues={Object.entries(diffOptions)
            .filter(([, v]) => !!v)
            .map(([k]) => k as DiffOptionKey)}
          values={DiffOptionKeys.map((k) => ({
            label: k,
            value: k,
          }))}
        />
      </div>
    </div>
  )
}

const root = css``

const radios = css`
  display: flex;
  flex-direction: row !important;
`
