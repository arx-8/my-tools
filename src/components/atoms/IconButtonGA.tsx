/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react"
import { IconButtonProps } from "@material-ui/core"
import IconButton from "@material-ui/core/IconButton"
import React from "react"
import { ButtonGAProps } from "src/components/atoms/ButtonGA"

type P = ButtonGAProps & IconButtonProps

/**
 * MuiButton with Google Analytics
 */
export const IconButtonGA: React.FC<P> = ({ children, gaData, ...rest }) => {
  return (
    <IconButton
      data-event-action={gaData.dataEventAction}
      data-event-category={gaData.dataEventCategory}
      data-on={gaData.dataOn}
      {...rest}
    >
      {children}
    </IconButton>
  )
}
