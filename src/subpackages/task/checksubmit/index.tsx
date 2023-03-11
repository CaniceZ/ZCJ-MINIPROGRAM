import { View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { Input, Button } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import './index.less'

export default () => {
  const [val, setVal] = useState('')
  const onChange = (value) => {
    setVal(value)
  }
  const formmatAge = (value: string) => {
    let newValue = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.5')
    setVal(newValue)
    return newValue
  }
  const submit = () => {
    showToast({ title: val + '', icon: 'none' })
  }
  return (
    <>
      <View className='checksubmit-wrap'>
        <View className='checksubmit-title'>2023-02-28 服务工时(小时)</View>
        <View className='checksubmit-label'>工时(小时)</View>
        {/* <Input className='input-wrap' value={val} type='digit' onInput={onChange} /> */}
        <Input
          className='input-wrap'
          formatter={formmatAge}
          defaultValue={val}
          type='number'
          placeholder='请输入'
          onChange={onChange}
        />
        <View className='submit-btn'>
          <Button block type='info' onClick={submit}>
            提交
          </Button>
        </View>
      </View>
    </>
  )
}
