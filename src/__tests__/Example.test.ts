/**
 * for suppress the following error message
 * Cannot compile namespaces when the '--isolatedModules' flag is provided.
 * @see https://github.com/Microsoft/TypeScript/issues/15230
 */
export {}

/**
 * `npm test` が正しく動作することを確認するためのサンプル
 */
describe("Example", () => {
  it("testable", () => {
    // ## Arrange ##
    const list: readonly number[] = [...[1, 2, 3, 4, 5]]

    // ## Act ##
    const result = list
      .filter((n) => n % 2 === 0)
      .map((n) => n * 2)
      .reduce((l, r) => l + r)

    // ## Assert ##
    expect(result).toEqual(12)
  })
})

/**
 * 違いは、オブジェクトの比較
 * 迷ったら toStrictEqual を使う
 */
describe("Comparison of 'toStrictEqual', 'toBe' and 'toEqual'", () => {
  class Human {
    constructor(private name: string, private age: number) {}

    public getGreet(): string {
      return `My name is ${this.name}. ${this.age} years old`
    }
  }

  it("'toBe' is '==='", () => {
    // Literal
    expect(2).not.toBe("2")
    expect(2).not.toBe(true)
    expect(0).not.toBe(false)
    expect(false).toBe(false)

    // Array
    expect([1, 2, 4]).not.toBe([1, 2, 4])
    expect([1, 2, 4]).not.toBe([1, 4, 2])

    // Object
    expect({ v1: 1, v2: 2 }).not.toBe({ v1: 1, v2: 2 })
    expect({ v1: 1, v2: 2 }).not.toBe({ v2: 2, v1: 1 })
    const objInstance = { v1: 1, v2: 2 }
    expect(objInstance).toBe(objInstance)

    // class
    expect(new Human("taro", 20)).not.toBe(new Human("taro", 20))
    const classInstance = new Human("taro", 20)
    expect(classInstance).toBe(classInstance)
  })

  it("'toEqual' is 'deepEqual'", () => {
    // Literal
    expect(2).not.toEqual("2")
    expect(2).not.toEqual(true)
    expect(0).not.toEqual(false)
    expect(false).toEqual(false)

    // Array
    expect([1, 2, 4]).toEqual([1, 2, 4])
    expect([1, 2, 4]).not.toEqual([1, 4, 2])

    // Object
    expect({ v1: 1, v2: 2 }).toEqual({ v1: 1, v2: 2 })
    expect({ v1: 1, v2: 2 }).toEqual({ v2: 2, v1: 1 })
    const objInstance = { v1: 1, v2: 2 }
    expect(objInstance).toEqual(objInstance)

    // class
    expect(new Human("taro", 20)).toEqual(new Human("taro", 20))
    const classInstance = new Human("taro", 20)
    expect(classInstance).toEqual(classInstance)
  })

  /**
   * @see https://jestjs.io/docs/en/expect#tostrictequalvalue
   */
  describe("'toStrictEqual' is more strict than 'toEqual'", () => {
    class LaCroix {
      flavor: string

      constructor(flavor: string) {
        this.flavor = flavor
      }
    }

    it("are not semantically the same", () => {
      expect(new LaCroix("lemon")).toEqual({ flavor: "lemon" })
      expect(new LaCroix("lemon")).not.toStrictEqual({ flavor: "lemon" })
    })
  })
})

/**
 * @see https://jestjs.io/docs/en/expect#tostrictequalvalue
 */
describe("Exception test", () => {
  const throwable = (): never => {
    throw new Error("Lorem ipsum dolor sit amet")
  }

  it("assert exception message", () => {
    expect(() => {
      throwable()
    }).toThrowErrorMatchingInlineSnapshot(`"Lorem ipsum dolor sit amet"`)
  })
})
