import { View } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { Input, Button } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import './index.less'

export default () => {
  const [val, setVal] = useState()
  const onChange = (value) => {
    setVal(value)
  }
  const submit = () => {
    showToast({ title: val + '', icon: 'none' })
  }
  return (
    <>
      <View className='checksubmit-wrap'>
        <View className='checksubmit-title'>
          2023-02-28 {true ? '清洁房量(间)' : '服务工时(小时)'}
        </View>
        <View className='checksubmit-label'>{true ? '标间' : '工时(小时)'}</View>
        {/* <Input className='input-wrap' value={val} type='digit' onInput={onChange} /> */}
        <Input
          className='input-wrap'
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
