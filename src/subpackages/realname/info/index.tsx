import { View } from '@tarojs/components'
import { Button, Uploader, Input, Radio } from '@nutui/nutui-react-taro'
import { useState } from 'react'
import './index.less'

export default () => {
  const uploadUrl = 'https://my-json-server.typicode.com/linrufeng/demo/posts'
  const onStart = () => {
    console.log('start 触发')
  }
  const [state, setState] = useState({
    name: '郑创俊', // 姓名
    idcard: '12222333222222', // 身份证号
    bankcount: '', // 银行卡号
    tel: '', // 银行卡预留手机
    type: '', // 擅长工作
    age: '', // 工龄
    contactPeople: '', // 紧急联系人
    contactPhone: '', // 紧急联系人电话
  })
  return (
    <>
      <View className='realname-wrap'>
        <View className='upload-tit'>请拍摄并上传身份证照</View>
        <View className='upload-wrap'>
          <View className='upload-item'>
            <Uploader url={uploadUrl} onStart={onStart} className='upload-handle' />
            <View className='upload-txt'>拍摄正面</View>
          </View>
          <View className='upload-item'>
            <Uploader url={uploadUrl} onStart={onStart} className='upload-handle' />
            <View className='upload-txt'>拍摄反面</View>
          </View>
        </View>
      </View>
      <View className='realname-wrap p10'>
        <Input
          name='name'
          label='姓名'
          placeholder='姓名'
          inputAlign='right'
          defaultValue={state.name}
          readonly
        />
        <Input
          name='idcard'
          label='身份证号码'
          placeholder='身份证号码'
          defaultValue={state.idcard}
          inputAlign='right'
          type='text'
          readonly
        />
        <Input
          name='number'
          label='银行卡'
          placeholder='银行卡'
          defaultValue={state.bankcount}
          inputAlign='right'
          type='digit'
          maxlength={18}
        />
        <Input
          name='tel'
          labelWidth='120'
          label='银行卡预留手机号'
          placeholder='银行卡预留手机号'
          defaultValue={state.tel}
          inputAlign='right'
          type='tel'
          border={false}
        />
      </View>
      <View className='realname-wrap p10'>
        <View className='nut-input nut-input-border'>
          <View className='nut-input-label' style='width: 60px'>擅长工作</View>
          <View className='nut-input-value'>
            <Radio.RadioGroup value={state.type} direction='horizontal'>
              <Radio shape='button' value='1'>
                选项1
              </Radio>
              <Radio shape='button' value='2'>
                选项2
              </Radio>
              <Radio shape='button' value='3'>
                选项3
              </Radio>
              <Radio shape='button' value='4'>
                选项4
              </Radio>
            </Radio.RadioGroup>
          </View>
        </View>
        <Input
          name='number'
          label='工龄'
          placeholder='工龄'
          defaultValue={state.age}
          inputAlign='right'
          type='digit'
        />
        <Input
          name='contactPeople'
          label='紧急联系人'
          placeholder='紧急联系人'
          inputAlign='right'
          defaultValue={state.contactPeople}
        />
        <Input
          name='contactPhone'
          labelWidth='100'
          label='紧急联系人电话'
          placeholder='紧急联系人电话'
          defaultValue={state.contactPhone}
          inputAlign='right'
          type='tel'
          border={false}
        />
      </View>
      <View className='realname-bottom'>
        <View className='realname-bottom-btn'>
          <Button block type='info'>
            下一步
          </Button>
        </View>
      </View>
    </>
  )
}
