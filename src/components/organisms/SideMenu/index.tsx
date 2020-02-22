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
    <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
      <div
        css={menuBody}
        role="presentation"
        onClick={toggleOpen}
        onKeyDown={toggleOpen}
      >
        <List>
          {pageInfo.map(({ icon, linkTo, title }) => (
            <ListItem key={title} button onClick={() => history.push(linkTo)}>
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
