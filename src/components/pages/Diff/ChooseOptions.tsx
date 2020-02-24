/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import { Collapse, Typography } from "@material-ui/core"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import React, { useState } from "react"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div css={root}>
      <div css={header}>
        <Typography variant="h6">Diff options</Typography>
        <IconButtonGA
          css={openBtn}
          gaData={{
            dataEventAction: "toggleOpenOptions",
            dataEventCategory: "Bookmarkable Diff",
            dataOn: "click",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButtonGA>
      </div>

      <Collapse in={isOpen}>
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
      </Collapse>
    </div>
  )
}

const root = css``

const header = css`
  display: flex;
  align-items: center;
`

const openBtn = css`
  padding: 8px !important;
`

const radios = css`
  display: flex;
  flex-direction: row !important;
`
