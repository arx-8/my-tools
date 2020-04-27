import produce from "immer"

type Sortable = number

export const sortBy = <T extends Sortable>(
  values: T[],
  direction: "asc" | "desc"
): T[] => {
  return produce(values, (draft) => {
    draft.sort(direction === "asc" ? ascSorter : descSorter)
  })
}

type SorterReturn = 1 | 0 | -1

const ascSorter = <T extends Sortable>(a: T, b: T): SorterReturn => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

const descSorter = <T extends Sortable>(a: T, b: T): SorterReturn => {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}
