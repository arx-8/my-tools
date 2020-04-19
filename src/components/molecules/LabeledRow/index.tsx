import TableCell from "@material-ui/core/TableCell"
import TableRow from "@material-ui/core/TableRow"
import React, { ReactChild } from "react"

type Props = {
  children: ReactChild | ReactChild[]
  label: string
}

export const LabeledRow: React.FC<Props> = ({ children, label }) => {
  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  )
}
