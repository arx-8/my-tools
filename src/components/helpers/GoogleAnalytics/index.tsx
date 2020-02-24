import "autotrack/lib/plugins/event-tracker"

import { History } from "history"
import React, { useEffect } from "react"
import ReactGA from "react-ga"
import { GOOGLE_ANALYTICS_TRACKING_CODE } from "src/constants/env"

type Props = {
  children?: never
  history: History
}

export const GoogleAnalytics: React.FC<Props> = ({ history }) => {
  useEffect(() => {
    ReactGA.initialize(GOOGLE_ANALYTICS_TRACKING_CODE)

    // 直リンの捕捉
    const p = convertRealPathname(
      window.location.pathname,
      window.location.hash
    )
    ReactGA.set({ page: p })
    ReactGA.pageview(p)

    // 遷移の捕捉
    history.listen((listener) => {
      const p2 = convertRealPathname(listener.pathname, listener.hash)

      ReactGA.set({ page: p2 })
      ReactGA.pageview(p2)
    })

    // イベントの捕捉
    ReactGA.plugin.require("eventTracker", {
      attributePrefix: "data-",
    })

    // 初回のみでよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

/**
 * プライバシーに関わりそうなデータ(Query Params など)は収集したくないため、削って返す
 */
export const convertRealPathname = (pathname: string, hash: string): string => {
  const hashWithoutQuery = hash.replace(/\?.*$/, "?")
  return `${pathname}${hashWithoutQuery}`
}
