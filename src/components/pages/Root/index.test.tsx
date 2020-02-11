import { render } from "@testing-library/react"
import React from "react"

import { Root } from "."

test("renders learn react link", () => {
  const { getByText } = render(<Root />)
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
