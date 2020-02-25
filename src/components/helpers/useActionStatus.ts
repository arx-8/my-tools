import { useEffect, useState } from "react"
import { sleep } from "src/utils/threadUtils"

export type ActionStatus = "ready" | "started" | "done"

type ReturnValues = [ActionStatus]

/**
 * boolean の loading を、より詳細なステータスに変換する
 * @param isLoading
 * @param doneWaitMilliseconds done 表示を続ける時間
 */
export const useActionStatus = (
  isLoading: boolean,
  doneWaitMilliseconds: number
): ReturnValues => {
  const [status, setStatus] = useState<ActionStatus>("ready")

  useEffect(() => {
    ;(async () => {
      // ready & Not isLoading の場合
      if (status === "ready" && !isLoading) {
        // NOP
        return
      }
      // started & isLoading の場合
      if (status === "ready" && isLoading) {
        setStatus("started")
        return
      }
      // started & Not isLoading の場合
      if (status === "started" && !isLoading) {
        setStatus("done")
        await sleep(doneWaitMilliseconds)
        setStatus("ready")
      }
    })()
  }, [isLoading, status, doneWaitMilliseconds])

  return [status]
}
