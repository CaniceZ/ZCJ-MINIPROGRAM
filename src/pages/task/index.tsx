import { Tabs } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import TaskCell from '@/components/TaskCell'
import './index.less'

export default () => {
  const [tab1value, setTab1value] = useState('0')
  const listData = [
    {
      a: '11',
    },
    {
      a: '22',
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
