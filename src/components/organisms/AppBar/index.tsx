/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import MuiAppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import MenuIcon from "@material-ui/icons/Menu"
import React, { useState } from "react"
import { SideMenu } from "src/components/organisms/SideMenu"
import { padL2 } from "src/components/styles/styles"

type OwnProps = {
  children?: never
}

export const AppBar: React.FC<OwnProps> = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  return (
    <div css={root}>
      <MuiAppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsOpenMenu((prev) => !prev)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" css={padL2}>
            {"title TODO titletitletitletitle"}
          </Typography>
        </Toolbar>
      </MuiAppBar>

      <SideMenu isOpen={isOpenMenu} setIsOpen={setIsOpenMenu} />
    </div>
  )
}

const root = css`
  flex-grow: 1;
`
