import { Currency } from "src/dataLayer/exchangeRatesApi/types/shared"

export type FetchLatestResp = {
  base: Currency
  date: string
  rates: Rates
}

type Rates = {
  [key in Currency]: number
}
