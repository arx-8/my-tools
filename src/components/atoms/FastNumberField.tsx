import { InputProps, TextField, TextFieldProps } from "@material-ui/core"
import React, { useEffect, useState } from "react"

type EmptyableNumber = number | ""

type Props = {
  allowMinus?: boolean
  /** inputProps.step と同等機能 */
  arrowInputStep?: number
  children?: never
  /**
   * TextFieldProps.onChange との衝突回避のため、このような名前にしている
   * 固定 disable で onChangeValue={undefined} したいケースもあるが、
   * 定義忘れや TextFieldProps.onChange の誤用を回避するため、必須としている
   */
  onChangeValue: (value: number | undefined) => void
  value: number | undefined
} & TextFieldProps

export const FastNumberField: React.FC<Props> = ({
  allowMinus,
  arrowInputStep,
  onChangeValue,
  onFocus,
  value,
  ...rest
}) => {
  // We need to keep and update the state of the cell normally
  // `Warning: A component is changing an uncontrolled input...` を防ぐため、undefined の代わりに "" を使う
  const [tempValue, setTempValue] = useState<EmptyableNumber>(value ?? "")

  const onChangeTemp: InputProps["onChange"] = (e) => {
    if (allowMinus) {
      setTempValue(castNumberOrEmpty(e.target.value, tempValue))
    } else {
      const casted = castNumberOrEmpty(e.target.value, tempValue)
      setTempValue(casted === "" ? casted : preventMinus(casted))
    }
  }

  // We'll only update the external data when the input is blurred
  const onSubmit = (): void => {
    onChangeValue(emptyToUndefined(tempValue))
  }

  // If the initial-value is changed external, sync it up with our state
  useEffect(() => {
    setTempValue(value ?? "")
  }, [value])

  return (
    <TextField
      {...rest}
      onBlur={onSubmit}
      onChange={onChangeTemp}
      // onFocus 時に全選択された方が、ほとんどのケースで便利なため
      onFocus={onFocus ?? ((e) => e.target.select())}
      onKeyDown={(e) => {
        // ↑
        if (e.keyCode === 38) {
          setTempValue(
            (prev) => (emptyToUndefined(prev) ?? 0) + (arrowInputStep ?? 1)
          )
        }

        // ↓
        if (e.keyCode === 40) {
          setTempValue((prev) => {
            if (allowMinus) {
              return (emptyToUndefined(prev) ?? 0) - (arrowInputStep ?? 1)
            } else {
              return preventMinus(
                (emptyToUndefined(prev) ?? 0) - (arrowInputStep ?? 1)
              )
            }
          })
        }

        // Enter
        if (e.keyCode === 13) {
          // パフォーマンスチューニング。他のキー入力の submit は間引く。
          onSubmit()
        }
      }}
      value={tempValue.toLocaleString()}
    />
  )
}

const emptyToUndefined = (v: EmptyableNumber): number | undefined => {
  return v === "" ? undefined : v
}

const castNumberOrEmpty = (
  v: string,
  prevValue: EmptyableNumber
): EmptyableNumber => {
  // Number("") が 0 になるため、空文字が入力できなくなる問題を防ぐため
  if (v === "") {
    return ""
  }

  // 文字列入力 (isNaN) の場合に、入力値が消えるのは操作感が悪いため、前回入力値を保持する
  const maybe = Number(v.replace(/,/g, ""))
  return isNaN(maybe) ? prevValue : maybe
}

/**
 * 負数は 0 にして返す
 * 正数はそのまま返す
 */
const preventMinus = (num: number): number => {
  return num < 0 ? 0 : num
}
