import { View } from '@tarojs/components'
import { FC, useMemo } from 'react'

type Props = {
  id?: string
  size?: number
}

const Space: FC<Props> = (props) => {
  const { id = '', size = 4 } = props

  return useMemo(() => {
    return <View id={id} style={{ padding: `${size}px` }}></View>
  }, [])
}

export default Space
