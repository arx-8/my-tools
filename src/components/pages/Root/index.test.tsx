import { render } from "@testing-library/react"
import React from "react"
import { MockProviders } from "src/components/helpers/MockProviders"
import { Root } from "."

test("renders learn react link", () => {
  const { getByText } = render(
    <MockProviders>
      <Root />
    </MockProviders>
  )
  const linkElement = getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
