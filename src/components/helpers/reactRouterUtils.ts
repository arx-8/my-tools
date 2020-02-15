import { useLocation, useParams } from "react-router-dom"
import { CastAny } from "src/types/utils"

/// Query parameter はフラットな string のペアしかありえない
type BaseParams = Record<string, string>

/**
 * 標準の Query parameter が扱いづらいため、ラッピング
 * @template TQueryParams 空引数許可な動的パスもあるため、allow undefined
 * @returns 空引数許可な動的パスだとしても、{} は必ず返るため、NonNullable で undefined を取り除く
 */
export const useQueryParams = <
  TQueryParams extends BaseParams | undefined
>(): Partial<NonNullable<TQueryParams>> => {
  const location = useLocation()

  // 重複キーには対応しない（後勝ちで上書き）
  const queries: Record<string, string> = {}
  const rawQueries = new URLSearchParams(location.search).entries()
  for (const [k, v] of rawQueries) {
    queries[k] = v
  }

  return queries as CastAny
}

/**
 * 標準の useParams だと型定義が弱いため、ラッピング
 * @template TUrlParams 空引数許可な動的パスもあるため、allow undefined
 * @returns 空引数許可な動的パスだとしても、{} は必ず返るため、NonNullable で undefined を取り除く
 */
export const useParamsEx = <
  TUrlParams extends BaseParams | undefined
>(): Partial<NonNullable<TUrlParams>> => {
  return useParams() as CastAny
}
