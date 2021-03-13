import type { InputProps, TextFieldProps } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import React, {
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { NumberFormatProps } from "react-number-format"
import NumberFormat from "react-number-format"
import type { CastAny } from "src/types/utils"
import { preventMinus, toNumberSafe } from "src/utils/numberUtils"

type Props = {
  allowNegative?: boolean
  /** inputProps.step と同等機能 */
  arrowInputStep?: number
  children?: never
  /**
   * TextFieldProps.onChange との衝突回避のため、このような名前にしている
   * 固定 disable で onChangeValue={undefined} にしたいケースもあるが、
   * 定義忘れや TextFieldProps.onChange の誤用を回避するため、必須としている
   * （onChangeValue={() => {}} で代用すること）
   */
  onChangeValue: (value: number | undefined) => void
  value: number | undefined
} & TextFieldProps

export const FastNumberField: React.FC<Props> = ({
  allowNegative,
  arrowInputStep,
  onChangeValue,
  value,
}) => {
  // We need to keep and update the state of the cell normally
  // `Warning: A component is changing an uncontrolled input...` を防ぐため、空値は "" を使う
  const [tempValue, setTempValue] = useState(value ?? "")

  // If the initial-value is changed external, sync it up with our state
  useEffect(() => {
    setTempValue(value ?? "")
  }, [value])

  const onChange: InputProps["onChange"] = (e) => {
    setTempValue(e.target.value)
  }

  const onSubmit = (): void => {
    if (tempValue === "") {
      onChangeValue(undefined)
    } else {
      onChangeValue(Number(tempValue))
    }
  }

  const inputComponent: CastAny = useMemo(
    () =>
      NumberFormatCustomWithOpt({
        allowNegative,
        isNumericString: true,
        thousandSeparator: true,
      }),
    [allowNegative]
  )

  /**
   * 独自キー入力イベント
   */
  const onKeyDown: KeyboardEventHandler = (e) => {
    // ↑キー
    if (e.keyCode === 38) {
      setTempValue((_prev) => toNumberSafe(_prev) + (arrowInputStep ?? 1))
    }

    // ↓キー
    if (e.keyCode === 40) {
      setTempValue((prev) => {
        if (allowNegative) {
          return toNumberSafe(prev) - (arrowInputStep ?? 1)
        } else {
          return preventMinus(toNumberSafe(prev) - (arrowInputStep ?? 1))
        }
      })
    }

    // Enterキー
    if (e.keyCode === 13) {
      // パフォーマンスチューニング。他のキー入力の submit は間引く。
      onSubmit()
    }
  }

  return (
    <TextField
      InputProps={{ inputComponent }}
      onBlur={onSubmit}
      onChange={onChange}
      onKeyDown={onKeyDown}
      value={tempValue}
    />
  )
}

type NumberFormatCustomProps = {
  inputRef: (instance: NumberFormat | null) => void
  name: string
  onChange: (changeEventLike: {
    target: {
      value: string
    }
  }) => void
} & NumberFormatProps

const NumberFormatCustom: React.FC<NumberFormatCustomProps> = ({
  inputRef,
  name,
  onChange,
  ...other
}) => {
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        })
      }}
    />
  )
}

/**
 * react-number-format のオプションと material-ui.TextField の InputProps との適合のため、
 * 部分適用可能な function としている
 */
const NumberFormatCustomWithOpt = (
  options: NumberFormatProps
): React.FC<NumberFormatCustomProps> => (props) =>
  NumberFormatCustom({
    ...options,
    ...props,
  })
