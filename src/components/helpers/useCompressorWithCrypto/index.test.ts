import { act, renderHook } from "@testing-library/react-hooks"
import { UrlStoreValues } from "src/components/pages/Diff/utils"

import { useCompressorWithCrypto } from "."

describe("whole", () => {
  it("UTF-8 src", async () => {
    // ## Arrange ##
    const src: UrlStoreValues = {
      a: "The a text",
      b: "The b text",
      i: false,
      m: "TrimmedLines",
    }
    const password = "the password"

    const rendered = renderHook(() => useCompressorWithCrypto<UrlStoreValues>())

    // ## Act ##
    await act(async () => {
      const { compressWithEnc, decompressWithEnc } = rendered.result.current
      const compressed = await compressWithEnc(src, password)
      const decompressed = await decompressWithEnc(compressed, password)

      // ## Assert ##
      expect(decompressed).toStrictEqual(src)
    })
  })
})
