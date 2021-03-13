/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from "@emotion/react"
import { Slide, useScrollTrigger } from "@material-ui/core"
import MuiAppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import MenuIcon from "@material-ui/icons/Menu"
import React, { Fragment, useState } from "react"
import { Helmet } from "react-helmet"
import { useLocation } from "react-router-dom"
import { GitHubLink } from "src/components/atoms/GitHubLink"
import { IconButtonGA } from "src/components/atoms/IconButtonGA"
import { pageInfo } from "src/components/helpers/pageInfo"
import { SideMenu } from "src/components/organisms/SideMenu"
import { padL2 } from "src/components/styles/styles"

type OwnProps = {
  children?: never
}

export const AppBar: React.FC<OwnProps> = () => {
  const location = useLocation()
  const [isOpenMenu, setIsOpenMenu] = useState(false)
  const isScrolled = useScrollTrigger()

  const currentPage = pageInfo.find((p) => p.linkTo === location.pathname)

  return (
    <Fragment>
      <Helmet>
        <title>{currentPage?.title}</title>
      </Helmet>

      <Slide appear direction="down" in={!isScrolled}>
        <MuiAppBar>
          <Toolbar variant="dense">
            <IconButtonGA
              aria-label="menu"
              color="inherit"
              edge="start"
              gaData={{
                dataEventAction: "toggleOpenMenu",
                dataEventCategory: "AppBar",
                dataOn: "click",
              }}
              onClick={() => setIsOpenMenu((prev) => !prev)}
            >
              <MenuIcon />
            </IconButtonGA>
            <Typography color="inherit" css={padL2} variant="h6">
              {currentPage?.title}
            </Typography>

            <div css={space}></div>
            <GitHubLink tabIndex={-1} />
          </Toolbar>
        </MuiAppBar>
      </Slide>

      <SideMenu isOpen={isOpenMenu} setIsOpen={setIsOpenMenu} />
    </Fragment>
  )
}

const space = css`
  margin-left: auto;
`
