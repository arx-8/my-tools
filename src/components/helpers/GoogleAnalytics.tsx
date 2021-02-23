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
    // 個人情報(に近しい)データの消去のため、location キーをセットして query parameter を上書き消去する
    // @see https://support.google.com/analytics/answer/6366371
    // @see https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters?hl=ja#dl
    ReactGA.set({
      location: window.location.hostname,
      page: window.location.pathname,
    })
    ReactGA.pageview(window.location.pathname)

    // 遷移の捕捉
    history.listen((listener) => {
      ReactGA.set({
        location: listener.pathname,
        page: listener.pathname,
      })
      ReactGA.pageview(listener.pathname)
    })

    // イベントの捕捉
    ReactGA.plugin.require("eventTracker", {
      attributePrefix: "data-",
    })

    // 初回、1度のみの設定でよい
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
