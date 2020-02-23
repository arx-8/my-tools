/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/core"
import { Button, ButtonProps, CircularProgress } from "@material-ui/core"
import { green } from "@material-ui/core/colors"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import LinkIcon from "@material-ui/icons/Link"
import React from "react"
import { ActionStatus } from "src/components/helpers/useActionStatus"
import { CastAny } from "src/types/utils"

// color, size 等を変更したい場合は、props を追加して上書きする
const iconMap: Record<ActionStatus, ButtonProps["endIcon"]> = {
  done: <CheckCircleIcon style={{ color: green["500"] }} />,
  ready: <LinkIcon />,
  started: <CircularProgress size={24} />,
}

type OwnProps = {
  children: ButtonProps["children"]
  disabled: boolean
  exCss?: InterpolationWithTheme<CastAny>
  onClick: ButtonProps["onClick"]
  status: ActionStatus
}

export const ButtonWithLoading: React.FC<OwnProps> = ({
  children,
  disabled,
  exCss,
  onClick,
  status,
}) => {
  return (
    <Button
      color="primary"
      css={exCss}
      disabled={disabled}
      endIcon={iconMap[status]}
      onClick={onClick}
      variant="contained"
    >
      {children}
    </Button>
  )
}
