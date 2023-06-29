import { Tabs } from '@nutui/nutui-react-taro'
import { useEffect, useState } from 'react'
import TaskCell from '@/components/TaskCell'
import usePage from '@/hooks/usePage'
import { usePullDownRefresh, stopPullDownRefresh, useDidShow } from '@tarojs/taro'
import { pageHelperTask } from '@/api/task'
import storage from '@/utils/storage'
import NoData from '@/components/NoData'
import './index.less'

export default () => {
  const [tab1value, setTab1value] = useState(0)
  const { lists, fetchData } = usePage(pageHelperTask, {
    limit: 10,
  })
  usePullDownRefresh(() => {
    fetchData({
      helperCode: storage.get('helperCode'),
      helperTaskStatusSet:
        tab1value === 0 ? undefined : tab1value === 10 ? [10, 20, 30] : [tab1value],
    })
    stopPullDownRefresh()
  })
  useEffect(() => {
    fetchData({
      helperCode: storage.get('helperCode'),
      helperTaskStatusSet:
        tab1value === 0 ? undefined : tab1value === 10 ? [10, 20, 30] : [tab1value],
    })
  }, [tab1value])

  useDidShow(() => {
    fetchData({
      helperCode: storage.get('helperCode'),
      helperTaskStatusSet:
        tab1value === 0 ? undefined : tab1value === 10 ? [10, 20, 30] : [tab1value],
    })
  })
  return (
    <>
      <Tabs
        className='task-tab'
        value={tab1value}
        color='#4D8FFF'
        background='#fff'
        onChange={({ paneKey }) => {
          setTab1value(paneKey)
        }}
      >
        <Tabs.TabPane title='全部任务' className='bg-tab-pane' paneKey={0}>
          {lists.length > 0 ? (
            lists.map((_, index) => <TaskCell key={index} {..._}></TaskCell>)
          ) : (
            <NoData></NoData>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane title='待处理' className='bg-tab-pane' paneKey={10}>
          {lists.length > 0 ? (
            lists.map((_, index) => <TaskCell key={index} {..._}></TaskCell>)
          ) : (
            <NoData></NoData>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane title='已完成' className='bg-tab-pane' paneKey={40}>
          {lists.length > 0 ? (
            lists.map((_, index) => <TaskCell key={index} {..._}></TaskCell>)
          ) : (
            <NoData></NoData>
          )}
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}
