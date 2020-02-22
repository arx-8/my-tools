import MuiAppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import MenuIcon from "@material-ui/icons/Menu"
import React, { Fragment, useState } from "react"
import { useLocation } from "react-router-dom"
import { pageInfo } from "src/components/helpers/pageInfo"
import { SideMenu } from "src/components/organisms/SideMenu"
import { padL2 } from "src/components/styles/styles"

type OwnProps = {
  children?: never
}

export const AppBar: React.FC<OwnProps> = () => {
  const location = useLocation()
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  return (
    <Fragment>
      <MuiAppBar>
        <Toolbar variant="dense">
          <IconButton
            aria-label="menu"
            color="inherit"
            edge="start"
            onClick={() => setIsOpenMenu((prev) => !prev)}
          >
            <MenuIcon />
          </IconButton>
          <Typography color="inherit" css={padL2} variant="h6">
            {pageInfo.find((p) => p.linkTo === location.pathname)?.title}
          </Typography>
        </Toolbar>
      </MuiAppBar>

      <SideMenu isOpen={isOpenMenu} setIsOpen={setIsOpenMenu} />
    </Fragment>
  )
}
