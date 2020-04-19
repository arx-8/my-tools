import { FetchLatestQueryParams } from "src/dataLayer/exchangeRatesApi/types/FetchLatestQueryParams"
import { FetchLatestResp } from "src/dataLayer/exchangeRatesApi/types/FetchLatestResp"
import { FixMeAny } from "src/types/utils"

const API_BASE_PATH = "https://api.exchangeratesapi.io"

export const fetchLatest = async (
  queryParams: FetchLatestQueryParams
): Promise<FetchLatestResp> => {
  const resp = await fetch(
    `${API_BASE_PATH}/latest?${new URLSearchParams(
      queryParams as FixMeAny
    ).toString()}`
  )
  return await resp.json()
}
