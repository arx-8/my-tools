import { compress, decompress } from "."

describe("compress & decompress", () => {
  it("whole", async () => {
    // ## Arrange ##
    const src = {
      0: 0,
      1: -1,
      a: "A value",
      boolF: false,
      boolT: true,
      t_1: `かゆ
うま
`,
      t_2: "https://www.google.com/search?q=%E3%81%82&oq=%E3%81%82",
      t_3: "😂",
    }

    // ## Act ##
    const result = await decompress(await compress(src))

    // ## Assert ##
    console.log(result)
    expect(result).toStrictEqual(src)
  })
})
