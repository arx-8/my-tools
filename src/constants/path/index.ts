import { CastAny, ValueOf } from "src/types/utils"
import { CompressedString } from "src/utils/compress"
import { Brand } from "utility-types"

// --- react-router用のパスの定義 ---
/**
 * react-router用のパスの定義
 */
const _ReactRouterPath = {
  diff: "/diff",
  leverage_calculator: "/leverage_calculator",
  mysql_table_to_x: "/mysql_table_to_x",
  not_found: "/notfound",
  root: "/",
} as const

/**
 * この App に存在する全ての routing path
 */
type ReactRouterPathKey = keyof typeof _ReactRouterPath

/**
 * ReactRouterPath の値を Brand 型に縛るための型
 * history.push では使えない path の値 (<Route /> でのみ使える)
 */
export type ReactRouterPathValue = ValueOf<typeof _ReactRouterPath>
export const ReactRouterPath: Record<
  ReactRouterPathKey,
  ReactRouterPathValue
> = _ReactRouterPath as CastAny

// --- 動的なパスの定義 ---
/**
 * history.push で使える path の値
 */
export type RoutePath = Brand<string, "RoutePath">

/**
 * （今のところ）不要なため、%エンコーディングを省略している
 * 必要になれば、querystring を使うべき
 * @param url e.g. "/diff"
 * @param queryParams { v: "value"}
 * @returns e.g. "/diff?v=value"
 */
const buildUrlWithQueryParams = (
  url: string,
  queryParams: Record<string, string | undefined> | undefined
): string => {
  if (queryParams == null) {
    return url
  }
  return `${url}?${Object.entries(queryParams)
    .map(([k, v]) => `${k}=${v}`)
    .reduce((acc, curr) => (acc += `&${curr}`), "")
    .slice(1)}`
}

/**
 * 動的なパスの定義
 * react-router.useParams の generics のために、 Parameters から型を導出可能にするため、引数は object にする
 */
export const DynamicRoutePath = {
  /**
   * ブクマ URL を少しでも短くするため、なるべく短いキー名にしている
   * @param params 空ブクマ表示も許可するため、allow undefined
   */
  diff: (params?: { v: CompressedString }): RoutePath => {
    return buildUrlWithQueryParams(ReactRouterPath.diff, params) as RoutePath
  },
} as const

// インテリセンスを無効にさせたくないため、直接型指定できない定義の型チェック
// ReactRouterPathKey 存在しないパスを定義した時に、ここでエラーが発生して、定義ミスを発見できる
type DynamicRoutePathKey = keyof typeof DynamicRoutePath
type KeyCheck = ReactRouterPathKey | DynamicRoutePathKey
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _: ReactRouterPathKey = (null as CastAny) as KeyCheck

// --- 静的なパスの定義 ---
/**
 * 静的なパスの定義
 * 動的なパスは `DynamicRoutePath` を使う
 */
export const StaticRoutePath: Record<
  // DynamicRoutePath に定義済みの場合は、そちらを使わせるために、型を引く
  Exclude<ReactRouterPathKey, keyof typeof DynamicRoutePath>,
  RoutePath
> = _ReactRouterPath as CastAny
