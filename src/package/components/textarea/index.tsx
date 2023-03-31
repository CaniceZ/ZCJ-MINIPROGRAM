import {
  View,
  Textarea as TaroTextarea,
  TextareaProps as TaroTextareaProps,
  CommonEventFunction,
} from '@tarojs/components'
import classNames from 'classnames'
import { FC, useCallback } from 'react'

export interface TextareaProps extends TaroTextareaProps {
  className2?: string
  showCount?: boolean
  readonly?: boolean
  height?: string | number
  onChange?: CommonEventFunction<TaroTextareaProps.onInputEventDetail>
}

const Textarea: FC<TextareaProps> = (props) => {
  const { value, maxlength = 500, className2, showCount, readonly = false, onChange } = props
  const TextareaClassname = classNames('ygp-textarea', className2)

  const handleInput = useCallback((e) => {
    onChange?.(e)
  }, [])

  return readonly ? (
    <View>{value}</View>
  ) : (
    <View className={TextareaClassname}>
      <TaroTextarea onInput={handleInput} {...props}></TaroTextarea>
      {showCount && (
        <View className='ygp-textarea-count'>
          {value ? value.length : 0}/{maxlength}
        </View>
      )}
    </View>
  )
}

export default Textarea
