import { act, renderHook } from "@testing-library/react-hooks"
import { UrlStoreValues } from "src/components/pages/Diff/utils"
import { useCompressor } from "."

describe("whole", () => {
  it("UTF-8 src", async () => {
    // ## Arrange ##
    const src: UrlStoreValues = {
      a: "あいうえお",
      b: "The b text",
      i: false,
      m: "TrimmedLines",
    }

    const rendered = renderHook(() => useCompressor<UrlStoreValues>())

    // ## Act ##
    await act(async () => {
      const { compress, decompress } = rendered.result.current
      const compressed = await compress(src)
      const decompressed = await decompress(compressed)

      // ## Assert ##
      expect(decompressed).toStrictEqual(src)
    })
  })
})
