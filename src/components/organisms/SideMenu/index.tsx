/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import React from "react"
import { useHistory } from "react-router-dom"
import { pageInfo } from "src/components/helpers/pageInfo"

type OwnProps = {
  children?: never
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SideMenu: React.FC<OwnProps> = ({ isOpen, setIsOpen }) => {
  const history = useHistory()

  const toggleOpen = (event: React.KeyboardEvent | React.MouseEvent): void => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      // メニュー選択に便利なキー入力で close しないようにするため
      return
    }

    setIsOpen(!isOpen)
  }

  return (
    <Drawer onClose={() => setIsOpen(false)} open={isOpen}>
      <div
        css={menuBody}
        onClick={toggleOpen}
        onKeyDown={toggleOpen}
        role="presentation"
      >
        <List>
          {pageInfo.map(({ icon, linkTo, title }) => (
            <ListItem button key={title} onClick={() => history.push(linkTo)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

const menuBody = css`
  width: 250px;
`
