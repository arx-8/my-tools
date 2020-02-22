/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/core"
import {
  Button,
  ButtonProps,
  CircularProgress,
  CircularProgressProps,
} from "@material-ui/core"
import React from "react"
import { CastAny } from "src/types/utils"

type OwnProps = {
  children: ButtonProps["children"]
  /**
   * Not isLoading 状態で表示するアイコン
   */
  defaultIcon: ButtonProps["endIcon"]
  exCss?: InterpolationWithTheme<CastAny>
  isLoading: boolean
  loadingIconProps?: CircularProgressProps
  onClick: ButtonProps["onClick"]
}

export const ButtonWithLoading: React.FC<OwnProps> = ({
  exCss,
  isLoading,
  onClick,
  defaultIcon,
  children,
  loadingIconProps,
}) => {
  return (
    <Button
      css={exCss}
      disabled={isLoading}
      variant="contained"
      color="primary"
      onClick={onClick}
      endIcon={
        isLoading ? <CircularProgress {...loadingIconProps} /> : defaultIcon
      }
    >
      {children}
    </Button>
  )
}
