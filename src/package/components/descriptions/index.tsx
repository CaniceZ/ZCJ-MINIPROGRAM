import { View } from '@tarojs/components'
import classNames from 'classnames'
import { FC, useCallback, useRef } from 'react'
import DescriptionsContext, { ContextTypes } from './context'

type DescriptionsProps = {
  className?: string
  onClick?: (event) => void
} & ContextTypes

const Descriptions: FC<DescriptionsProps> = (props) => {
  const { className = '', children, labelWidth = 'auto', textAlign = 'left', onClick } = props
  const value = useRef<ContextTypes>({
    labelWidth: labelWidth,
    textAlign: textAlign,
  })

  const handleClick = useCallback((event) => {
    onClick && onClick(event)
  }, [])

  return (
    <DescriptionsContext.Provider value={value.current}>
      <View className={classNames('descriptions', className)} onClick={handleClick}>
        {children}
      </View>
    </DescriptionsContext.Provider>
  )
}

export default Descriptions
