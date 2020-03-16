import { csvToObject, mysqlTableToCsv, mysqlTableToJson } from "."

describe("csvToObject", () => {
  it("flat with unexpected space", () => {
    // ## Arrange ##
    const csv = `


first_name,last_name,gender
Dennis,Anderson,Male
Peter,Hicks,Male


`

    // ## Act ##
    const result = csvToObject(csv)

    // ## Assert ##
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "first_name": "Dennis",
          "gender": "Male",
          "last_name": "Anderson",
        },
        Object {
          "first_name": "Peter",
          "gender": "Male",
          "last_name": "Hicks",
        },
      ]
    `)
  })

  it("hierarchical", () => {
    // ## Arrange ##
    const csv = `\
device,owner.name.first,owner.name.last,owner.gender
94-0B-05-0E-E9-35,Pamela,Hart,Female
69-71-86-FD-B1-24,Karen,Pierce,Female
`

    // ## Act ##
    const result = csvToObject(csv)

    // ## Assert ##
    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "device": "94-0B-05-0E-E9-35",
          "owner": Object {
            "gender": "Female",
            "name": Object {
              "first": "Pamela",
              "last": "Hart",
            },
          },
        },
        Object {
          "device": "69-71-86-FD-B1-24",
          "owner": Object {
            "gender": "Female",
            "name": Object {
              "first": "Karen",
              "last": "Pierce",
            },
          },
        },
      ]
    `)
  })
})

describe("mysqlTableToCsv", () => {
  it("ok", () => {
    // ## Arrange ##
    const table = `\
+------+-------+-----------+
| id   | sales | client_id |
+------+-------+-----------+
| A103 |   125 |         1 |
| A101 |   350 |         2 |
| B107 |    14 |         1 |
+------+-------+-----------+
`

    // ## Act ##
    const result = mysqlTableToCsv(table)

    // ## Assert ##
    expect(result).toMatchInlineSnapshot(`
      "id,sales,client_id
      A103,125,1
      A101,350,2
      B107,14,1"
    `)
  })
})

describe("mysqlTableToJson", () => {
  it("ok", () => {
    // ## Arrange ##
    const table = `\
+------+-------+-----------+
| id   | sales | client_id |
+------+-------+-----------+
| A103 |   125 |         1 |
| A101 |   350 |         2 |
| B107 |    14 |         1 |
+------+-------+-----------+
`

    // ## Act ##
    const result = mysqlTableToJson(table)

    // ## Assert ##
    expect(result).toMatchInlineSnapshot(`
      "[
        {
          \\"id\\": \\"A103\\",
          \\"sales\\": 125,
          \\"client_id\\": 1
        },
        {
          \\"id\\": \\"A101\\",
          \\"sales\\": 350,
          \\"client_id\\": 2
        },
        {
          \\"id\\": \\"B107\\",
          \\"sales\\": 14,
          \\"client_id\\": 1
        }
      ]"
    `)
  })
})
