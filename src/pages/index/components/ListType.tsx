import { View, Image } from '@tarojs/components'
import { FC } from 'react'
import settingIcon from '@/assets/imgs/im-facedefault.png'
import classNames from 'classnames'
import './ListType.less'

type Props = {
  value: String | Number | undefined
  onChange: Function
}
const ListType: FC<Props> = (props) => {
  const { value, onChange } = props
  const list = [
    {
      name: '客房',
      value: 1,
      scr: settingIcon,
    },
    {
      name: '小时工',
      value: 2,
      scr: settingIcon,
    },
    {
      name: '厨师',
      value: 3,
      scr: settingIcon,
    },
    {
      name: '洗碗',
      value: 4,
      scr: settingIcon,
    },
    {
      name: '洗衣房',
      value: 5,
      scr: settingIcon,
    },
    {
      name: '公区保洁',
      value: 6,
      scr: settingIcon,
    },
    {
      name: '救生员',
      value: 7,
      scr: settingIcon,
    },
    {
      name: '工程维修',
      value: 8,
      scr: settingIcon,
    },
  ]
  const handleChange = (item) => {
    onChange(item.value)
  }
  return (
    <View className='list-type'>
      {list.map((item) => (
        <View
          className={classNames('list-type-item', {
            'item-active': item.value === value,
          })}
          key={item.name}
          onClick={() => {
            handleChange(item)
          }}
        >
          <Image mode='aspectFit' className='list-type-image' src={settingIcon}></Image>
          <View className='list-type-name'>{item.name}</View>
        </View>
      ))}
    </View>
  )
}
export default ListType
