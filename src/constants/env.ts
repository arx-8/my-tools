export const isDevelopment = process.env.NODE_ENV !== "production"

export const GOOGLE_ANALYTICS_TRACKING_CODE = process.env
  .REACT_APP_GOOGLE_ANALYTICS_TRACKING_CODE!

// 定義忘れチェック
if (isDevelopment) {
  if (GOOGLE_ANALYTICS_TRACKING_CODE == null) {
    throw new Error("GOOGLE_ANALYTICS_TRACKING_CODE is undefined!")
  }
}
