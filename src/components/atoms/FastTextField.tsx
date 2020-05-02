import { InputProps, TextField, TextFieldProps } from "@material-ui/core"
import React, { useEffect, useState } from "react"

type OwnProps = {
  children?: never
  /**
   * TextFieldProps.onChange との衝突回避のため、このような名前にしている
   * 固定 disable で onChangeValue={undefined} したいケースもあるが、
   * 定義忘れや TextFieldProps.onChange の誤用を回避するため、必須としている
   */
  onChangeValue: (value: string) => void
  value: string | undefined
} & TextFieldProps

/**
 * onChange より反映を遅らせて、入力の体感速度を向上させる Field
 * onChange 以外のイベントで値が反映される
 * onChange は、内部 state にのみ値が反映される
 * 注意: 反映のイベントを減らしすぎると、逆に値が反映されず困る
 *    例えば、onBlur のみ値を反映、とすると、Enter submit で値が反映されない
 */
export const FastTextField: React.FC<OwnProps> = ({
  value,
  onChangeValue,
  onFocus,
  ...rest
}) => {
  // We need to keep and update the state of the cell normally
  const [tempValue, setTempValue] = useState(value)

  const onChange: InputProps["onChange"] = (e) => {
    setTempValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onSubmit = (): void => {
    if (tempValue == null) {
      return
    }
    onChangeValue(tempValue)
  }

  // If the initial-value is changed external, sync it up with our state
  useEffect(() => {
    setTempValue(value)
  }, [value])

  return (
    <TextField
      {...rest}
      onBlur={onSubmit}
      onChange={onChange}
      // onFocus 時に全選択された方が、ほとんどのケースで便利なため
      onFocus={onFocus ?? ((e) => e.target.select())}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          // パフォーマンスチューニング。他のキー入力は間引く
          onSubmit()
        }
      }}
      value={tempValue}
    />
  )
}
