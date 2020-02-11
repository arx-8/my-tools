/** @jsx jsx */
import { css, jsx } from "@emotion/core"
import Divider from "@material-ui/core/Divider"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import MailIcon from "@material-ui/icons/Mail"
import InboxIcon from "@material-ui/icons/MoveToInbox"
import React from "react"

type OwnProps = {
  children?: never
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SideMenu: React.FC<OwnProps> = ({ isOpen, setIsOpen }) => {
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
    <div>
      <Drawer open={isOpen} onClose={() => setIsOpen(false)}>
        <div
          css={menuBody}
          role="presentation"
          onClick={toggleOpen}
          onKeyDown={toggleOpen}
        >
          <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  )
}

const menuBody = css`
  width: 250px;
`
