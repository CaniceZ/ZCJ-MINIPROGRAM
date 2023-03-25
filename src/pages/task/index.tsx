import { Tabs } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import TaskCell from '@/components/TaskCell'
import './index.less'

export default () => {
  const [tab1value, setTab1value] = useState('0')
  const listData = [
    {
      merchantName: '网鱼电竞酒店',
      merchantTaskStatus: 10,
      merchantTaskStatusName: '待开始',
      serviceStartDate: '2023-03-16',
      serviceEndDate: '2023-03-17',
      shiftStartTime: '09:00',
      shiftEndTime: '18:00',
      daogangshijian: '8:30',
      zonggongshi: 10,
      personNum: 5,
      workNum: 4,
      workDays: 2,
      jobTypeName: '服务员',
    },
    {
      merchantName: '网鱼电竞酒店2',
      merchantTaskStatus: 20,
      merchantTaskStatusName: '进行中',
      serviceStartDate: '2023-03-16',
      serviceEndDate: '2023-03-17',
      shiftStartTime: '09:00',
      shiftEndTime: '18:00',
      daogangshijian: '8:30',
      zonggongshi: 10,
      personNum: 5,
      workNum: 4,
      workDays: 2,
      jobTypeName: '服务员',
    },
    {
      merchantName: '网鱼电竞酒店2',
      merchantTaskStatus: 40,
      merchantTaskStatusName: '已完成',
      serviceStartDate: '2023-03-16',
      serviceEndDate: '2023-03-17',
      shiftStartTime: '09:00',
      shiftEndTime: '18:00',
      daogangshijian: '8:30',
      zonggongshi: 10,
      personNum: 5,
      workNum: 4,
      workDays: 2,
      jobTypeName: '服务员',
    },
  ]
  return (
    <>
      <Tabs
        value={tab1value}
        color='red'
        background='#fff'
        onChange={({ paneKey }) => {
          setTab1value(paneKey)
        }}
      >
        <Tabs.TabPane title='全部任务' className='bg-tab-pane'>
          {listData.map((_, index) => (
            <TaskCell key={index} {..._}></TaskCell>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane title='待开始' className='bg-tab-pane'>
          {' '}
          Tab 2{' '}
        </Tabs.TabPane>
        <Tabs.TabPane title='进行中' className='bg-tab-pane'>
          {' '}
          Tab 3{' '}
        </Tabs.TabPane>
        <Tabs.TabPane title='已完成' className='bg-tab-pane'>
          {' '}
          Tab 3{' '}
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}
