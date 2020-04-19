import { Currency } from "src/dataLayer/exchangeRatesApi/types/shared"

export type FetchLatestQueryParams = {
  base: Currency
  symbols: Currency[]
}
