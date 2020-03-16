/** @jsx jsx */
import { jsx } from "@emotion/core"
import { Button, ButtonProps } from "@material-ui/core"
import React from "react"

export type ButtonGAProps = {
  gaData: {
    dataEventAction: string
    dataEventCategory: "AppBar" | "Bookmarkable Diff" | "MySQL table to X"
    dataOn: "click" | "touchstart"
  }
}

type P = ButtonGAProps & ButtonProps

/**
 * MuiButton with Google Analytics
 */
export const ButtonGA: React.FC<P> = ({ children, gaData, ...rest }) => {
  return (
    <Button
      data-event-action={gaData.dataEventAction}
      data-event-category={gaData.dataEventCategory}
      data-on={gaData.dataOn}
      {...rest}
    >
      {children}
    </Button>
  )
}
