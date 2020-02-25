/**
 * プライバシーに関わりそうなデータ(Query Params など)は収集したくないため、削って返す
 */
export const convertFullPathnameWithoutQueryParams = (
  pathname: string,
  hash: string
): string => {
  const hashWithoutQuery = hash.replace(/\?.*$/, "?")
  return `${pathname}${hashWithoutQuery}`
}
