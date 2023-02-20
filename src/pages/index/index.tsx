import { View } from '@tarojs/components'
import { ListView } from '@/package'
import { Button } from '@nutui/nutui-react-taro';

import RealName from './components/RealName'
import TaskItem from './components/TaskItem'

import './index.less'

const data = Array(100).fill({})

const fetcher = async (params) => {
  console.log('params', params)
  const { page, limit } = params
  let arr = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.slice((page - 1) * limit, page * limit))
    }, 1000)
  })
  console.log('arr', arr)
  return { list: arr, total: 111 }
}

export default () => {
  const { listData, listViewProps } = ListView.useListView(fetcher as any, {
    limit: 50,
  })
  return (
    <View>
      <Button type='primary'>主要按钮</Button>
      <RealName></RealName>
      total：{listViewProps.pagination.total}
      <ListView {...listViewProps}>
        {listData.map((_, index) => (
          <TaskItem key={index} index={index}></TaskItem>
        ))}
      </ListView>
    </View>
  )
}
