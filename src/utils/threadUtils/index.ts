export const sleep = (millisecond: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, millisecond)
  })
}
