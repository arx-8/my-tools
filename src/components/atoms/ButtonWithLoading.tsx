/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/react"
import { ButtonProps, CircularProgress } from "@material-ui/core"
import { green } from "@material-ui/core/colors"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import LinkIcon from "@material-ui/icons/Link"
import React from "react"
import { ButtonGA, ButtonGAProps } from "src/components/atoms/ButtonGA"
import { ActionStatus } from "src/components/helpers/useActionStatus"

// color, size 等を変更したい場合は、props を追加して上書きする
const iconMap: Record<ActionStatus, ButtonProps["endIcon"]> = {
  done: <CheckCircleIcon style={{ color: green["500"] }} />,
  ready: <LinkIcon />,
  started: <CircularProgress size={24} />,
}

type OwnProps = {
  children: ButtonProps["children"]
  disabled: boolean
  exCss?: SerializedStyles
  onClick: ButtonProps["onClick"]
  status: ActionStatus
}

type P = OwnProps & ButtonGAProps

export const ButtonWithLoading: React.FC<P> = ({
  children,
  disabled,
  exCss,
  onClick,
  status,
  ...rest
}) => {
  return (
    <ButtonGA
      color="primary"
      css={exCss}
      disabled={disabled}
      endIcon={iconMap[status]}
      onClick={onClick}
      variant="contained"
      {...rest}
    >
      {children}
    </ButtonGA>
  )
}
