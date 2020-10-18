import { useState } from "react"

type Props<TData extends object> = {
  cacheTime?: number
  fetcher: () => Promise<TData>
}

type ReturnType<TData extends object> = {
  data?: TData
  execFetch: () => Promise<TData | undefined>
  isFetching: boolean
}

export const useFetch = <TData extends object>({
  cacheTime = 1,
  fetcher,
}: Props<TData>): ReturnType<TData> => {
  const [isFetching, setIsFetching] = useState(false)
  const [cache, setCache] = useState<TData | undefined>(undefined)
  const [lastUpdateTime, setLastUpdateTime] = useState(0)

  return {
    execFetch: async () => {
      setIsFetching(true)

      // 現在日時がまだ cache expired でない場合
      if (new Date().getTime() < lastUpdateTime + cacheTime) {
        setIsFetching(false)
        return cache
      }

      let result
      try {
        result = await fetcher()
      } catch (error) {
        console.warn(error)
        setIsFetching(false)
        return
      }

      setCache(result)
      setLastUpdateTime(new Date().getTime())
      setIsFetching(false)
      return result
    },
    isFetching,
  }
}
