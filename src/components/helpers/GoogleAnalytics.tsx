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
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)

    // 遷移の捕捉
    history.listen((listener) => {
      ReactGA.set({ page: listener.pathname })
      ReactGA.pageview(listener.pathname)
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
