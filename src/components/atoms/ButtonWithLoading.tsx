/** @jsx jsx */
import { InterpolationWithTheme, jsx } from "@emotion/core"
import { Button, ButtonProps, CircularProgress } from "@material-ui/core"
import { green } from "@material-ui/core/colors"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import LinkIcon from "@material-ui/icons/Link"
import React from "react"
import { ActionStatus } from "src/components/helpers/useActionStatus"
import { CastAny } from "src/types/utils"

type IconMap = Record<ActionStatus, ButtonProps["endIcon"]>

const defaultIconMap: IconMap = {
  done: <CheckCircleIcon style={{ color: green["500"] }} />,
  ready: <LinkIcon />,
  started: <CircularProgress size={24} />,
}

type OwnProps = {
  children: ButtonProps["children"]
  disabled: boolean
  exCss?: InterpolationWithTheme<CastAny>
  iconMap?: Partial<IconMap>
  onClick: ButtonProps["onClick"]
  status: ActionStatus
}

export const ButtonWithLoading: React.FC<OwnProps> = ({
  children,
  disabled,
  exCss,
  iconMap,
  onClick,
  status,
}) => {
  const _iconMap = iconMap ?? defaultIconMap
  const endIcon = _iconMap[status] ?? defaultIconMap[status]

  return (
    <Button
      color="primary"
      css={exCss}
      disabled={disabled}
      endIcon={endIcon}
      onClick={onClick}
      variant="contained"
    >
      {children}
    </Button>
  )
}
