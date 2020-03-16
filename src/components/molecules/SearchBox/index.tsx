/** @jsx jsx */
import { jsx } from "@emotion/core"
import { createStyles, fade, makeStyles } from "@material-ui/core"
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from "@material-ui/icons/Search"
import React from "react"

type OwnProps = {
  autoFocus?: boolean
  children?: never
  onChange: (next: string) => void
  value: string
}

const useStyles = makeStyles((theme) =>
  createStyles({
    inputInput: {
      padding: theme.spacing(1, 1, 1, 4),
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: 200,
      },
    },
    inputRoot: {
      color: "inherit",
    },
    search: {
      "&:hover": {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      backgroundColor: fade(theme.palette.common.white, 0.15),
      borderRadius: theme.shape.borderRadius,
      marginLeft: 0,
      marginRight: theme.spacing(2),
      position: "relative",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
      },
    },
    searchIcon: {
      alignItems: "center",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      pointerEvents: "none",
      position: "absolute",
      width: theme.spacing(4),
    },
  })
)

export const SearchBox: React.FC<OwnProps> = ({
  autoFocus,
  onChange,
  value,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        classes={{
          input: classes.inputInput,
          root: classes.inputRoot,
        }}
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search…"
        value={value}
      />
    </div>
  )
}
