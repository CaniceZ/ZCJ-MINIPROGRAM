import { View } from '@tarojs/components'
import classNames from 'classnames'
import { FC, useContext } from 'react'
import DescriptionsContext, { ContextTypes } from '../context'

type Props = {
  label: string
  layout?: 'vertical' | 'horizontal'
  className?: string
}

const DescriptionsItem: FC<Props> = (props) => {
  const { children, className = '', label, layout = 'horizontal' } = props
  const context = useContext<ContextTypes>(DescriptionsContext)

  return (
    <View className={classNames('descriptions-item', className)}>
      <View
        className='descriptions-item__content'
        style={{ flexDirection: layout === 'horizontal' ? 'row' : 'column' }}
      >
        <View className='descriptions-item__label' style={{ width: context.labelWidth }}>
          {label}
        </View>
        <View className='descriptions-item__value' style={{ textAlign: context.textAlign }}>
          {children}
        </View>
      </View>
    </View>
  )
}

export default DescriptionsItem
