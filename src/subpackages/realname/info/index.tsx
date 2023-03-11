import { View } from '@tarojs/components'
import { Button, Uploader, Input, Radio } from '@nutui/nutui-react-taro'
import useSetState from '@/hooks/useSetState'
import { showToast } from '@tarojs/taro'
import './index.less'

export default () => {
  const uploadUrl = 'https://my-json-server.typicode.com/linrufeng/demo/posts'
  const onStart = () => {
    console.log('start 触发')
  }
  const [state, setState] = useSetState({
    name: '郑创俊', // 姓名
    idcard: '12222333222222', // 身份证号
    bankcount: '', // 银行卡号
    tel: '', // 银行卡预留手机
    type: '', // 擅长工作
    age: '', // 工龄
    contactPeople: '', // 紧急联系人
    contactPhone: '', // 紧急联系人电话
  })
  // 格式化工龄
  const formmatAge = (value: string) => {
    if (Number(value) > 100) {
      setState({ age: '100' })
      return 100
    } else {
      let newVal = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.5')
      setState({ age: newVal })
      return newVal
    }
  }
  const submit = () => {
    console.log(state)
    if (!state.bankcount || state.bankcount.length < 13) {
      // 银行卡
      showToast({ title: '请输入正确的银行卡号', icon: 'none' })
    } else if (state.tel.length !== 11) {
      // 银行卡预留手机
      showToast({ title: '请输入正确的银行卡预留手机号', icon: 'none' })
    } else if (!state.type) {
      // 擅长工作
      showToast({ title: '请选择擅长工作', icon: 'none' })
    } else if (!state.age) {
      // 工龄
      showToast({ title: '请输入工龄', icon: 'none' })
    } else if (!/^[a-zA-Z\u4E00-\u9FA5]+$/.test(state.contactPeople)) {
      // 紧急联系人
      showToast({ title: '请输入正确的紧急联系人', icon: 'none' })
    } else if (state.contactPhone.length !== 11) {
      // 紧急联系人手机
      showToast({ title: '请输入正确的紧急联系人手机', icon: 'none' })
    } else {
      console.log(state)
    }
  }
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
          name='bankcount'
          label='银行卡'
          placeholder='请输入银行卡'
          defaultValue={state.bankcount}
          onChange={(value) => {
            setState({ bankcount: value })
          }}
          inputAlign='right'
          type='digit'
          maxlength={19}
        />
        <Input
          name='tel'
          labelWidth='120'
          label='银行卡预留手机号'
          placeholder='请输入银行卡预留手机号'
          defaultValue={state.tel}
          onChange={(value) => {
            console.log(value)
            setState({ tel: value })
          }}
          inputAlign='right'
          type='digit'
          maxlength={11}
          border={false}
        />
      </View>
      <View className='realname-wrap p10'>
        <View className='nut-input nut-input-border'>
          <View className='nut-input-label' style='width: 60px'>
            擅长工作
          </View>
          <View className='nut-input-value'>
            <Radio.RadioGroup
              value={state.type}
              direction='horizontal'
              onChange={(value: any) => {
                setState({ type: value })
              }}
            >
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
          name='age'
          label='工龄（年）'
          placeholder='请填写工作年限'
          defaultValue={state.age}
          inputAlign='right'
          formatter={formmatAge}
          type='number'
        />
        <Input
          name='contactPeople'
          label='紧急联系人'
          placeholder='请输入紧急联系人'
          inputAlign='right'
          defaultValue={state.contactPeople}
          onChange={(value) => {
            setState({ contactPeople: value })
          }}
          maxlength={50}
        />
        <Input
          name='contactPhone'
          labelWidth='100'
          label='紧急联系人电话'
          placeholder='请输入紧急联系人电话'
          defaultValue={state.contactPhone}
          onChange={(value) => {
            setState({ contactPhone: value })
          }}
          inputAlign='right'
          type='digit'
          maxlength={11}
          border={false}
        />
      </View>
      <View className='realname-bottom'>
        <View className='realname-bottom-btn'>
          <Button block type='info' onClick={submit}>
            下一步
          </Button>
        </View>
      </View>
    </>
  )
}
