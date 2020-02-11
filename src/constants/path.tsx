import { Brand, CastAny, ValueOf } from "src/types/utils"

/**
 * react-router用のパスの定義
 */
const _RoutePath = {
  NotFound: "/notfound",
  Root: "/",
} as const

type RoutePathKey = keyof typeof _RoutePath

export type RoutePathValue = Brand<ValueOf<typeof _RoutePath>, "RoutePathValue">
export const RoutePath: Record<
  RoutePathKey,
  RoutePathValue
> = _RoutePath as CastAny

/**
 * 動的なパスの定義
 */
export const DynamicRoutePath = {} as const

export type DynamicRouteParams = {}

// インテリセンスを無効にさせたくないため、直接型指定できない定義の型チェック
// RoutePath 存在しないパスを定義した時に、ここでエラーが発生して、定義ミスを発見できる
type DynamicRoutePathKey = keyof typeof DynamicRoutePath
type KeyCheck = RoutePathKey | DynamicRoutePathKey
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _: RoutePathKey = (null as CastAny) as KeyCheck

type DynamicRouteParamsKey = keyof DynamicRouteParams
type KeyCheck2 = RoutePathKey | DynamicRouteParamsKey
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _2: RoutePathKey = (null as CastAny) as KeyCheck2
