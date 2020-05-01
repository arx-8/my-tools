import produce from "immer"

export type SortDirection = "asc" | "desc"

type Sortable = number

/**
 * 非破壊 sort
 */
export const sortBy = <T extends Sortable>(
  values: T[],
  direction: SortDirection
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

export const sum = (values: number[]): number => {
  return values.reduce((acc, curr) => (acc += curr), 0)
}

export const average = (values: number[]): number => {
  return sum(values) / values.length
}
