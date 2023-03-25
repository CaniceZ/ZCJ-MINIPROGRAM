import { View } from '@tarojs/components'
import { Button, TextArea, Uploader } from '@nutui/nutui-react-taro'
import useSetState from '@/hooks/useSetState'
import { showToast } from '@tarojs/taro'
import { Checkbox, Field } from '@/package'
import './index.less'

export default () => {
  const uploadUrl = 'https://my-json-server.typicode.com/linrufeng/demo/posts'
  const onStart = () => {
    console.log('start 触发')
  }
  const typeStatus = [
    { value: '2', label: '服务员' },
    { value: '4', label: '传菜' },
    { value: '1', label: '洗碗' },
    { value: '3', label: '咨客' },
    { value: '5', label: '打包员' },
  ]
  const onStatusChange = (active: string[]) => {
    setState({
      jobTypeList: active,
      jobTypeNameList: typeStatus
        .filter((item) => active.includes(item.value))
        .map((item2) => item2.label),
    })
  }
  const [state, setState] = useSetState({
    sex: '男', // 性别
    name: '郑创俊', // 姓名
    idcard: '12222333222222', // 身份证号
    bankcount: '', // 银行卡号
    tel: '', // 银行卡预留手机
    jobTypeList: [], // 擅长工作
    jobTypeNameList: [], // 擅长工作name
    age: '', // 工龄
    contactPeople: '', // 紧急联系人
    contactPhone: '', // 紧急联系人电话
    remark: '', // 个人优势
  })
  const submit = () => {
    console.log(state)
    if (!state.bankcount || state.bankcount.length < 13) {
      // 银行卡
      showToast({ title: '请输入正确的银行卡号', icon: 'none' })
    } else if (state.tel.length !== 11) {
      // 银行卡预留手机
      showToast({ title: '请输入正确的银行卡预留手机号', icon: 'none' })
    } else if (!state.jobTypeList[0]) {
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
      <View className='realname-wrap pb0'>
        <Field
          name='sex'
          labelWidth='80'
          label='性别'
          placeholder='请输入性别'
          value={state.sex}
          inputAlign='right'
          readonly
        />
        <Field
          name='name'
          labelWidth='80'
          label='姓名'
          placeholder='请输入姓名'
          value={state.name}
          inputAlign='right'
          readonly
        />
        <Field
          name='idcard'
          labelWidth='80'
          label='身份证号码'
          placeholder='请输入身份证号码'
          value={state.idcard}
          inputAlign='right'
          readonly
        />
        <Field
          name='bankcount'
          labelWidth='80'
          label='银行卡'
          placeholder='请输入银行卡'
          value={state.bankcount}
          onChange={(e) => {
            setState({ bankcount: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          type='digit'
          maxlength={19}
          clear={false}
        />
        <Field
          name='tel'
          labelWidth='120'
          label='银行卡预留手机号'
          placeholder='请输入银行卡预留手机号'
          value={state.tel}
          onChange={(e) => {
            setState({ tel: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          type='digit'
          maxlength={11}
          clear={false}
        />
      </View>
      <View className='realname-wrap pb0'>
        <View className='wy-form-item pb0 pt0'>
          <View className='wy-form-label' style='width: 80px'>
            擅长工作
          </View>
          <View className='flex-r'>
            <Checkbox value={state.jobTypeList} options={typeStatus} onChange={onStatusChange} />
          </View>
        </View>
        <Field
          name='age'
          labelWidth='120'
          label='工龄（年）'
          placeholder='请填写工作年限'
          value={state.age}
          onChange={(e) => {
            setState({ age: e ? e.detail.value : '' })
          }}
          min={18}
          max={70}
          inputAlign='right'
          type='number'
          clear={false}
        />
        <Field
          name='contactPeople'
          labelWidth='120'
          label='紧急联系人'
          placeholder='请输入紧急联系人'
          value={state.contactPeople}
          onChange={(e) => {
            setState({ contactPeople: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          maxlength={6}
          clear={false}
        />
        <Field
          name='contactPhone'
          labelWidth='120'
          label='紧急联系人电话'
          placeholder='请输入紧急联系人电话'
          value={state.contactPhone}
          onChange={(e) => {
            setState({ contactPhone: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          type='digit'
          maxlength={11}
          clear={false}
        />
      </View>
      <View className='realname-wrap'>
        <View className='wy-form-item no-bottom'>
          <View className='wy-form-label' style='width: 60px'>
            个人优势
          </View>
        </View>
        <View>
          <TextArea
            placeholder='请用几句话介绍自己吧，限200字'
            maxlength='200'
            limitshow
            className='text-1'
            style={{ fontSize: '12px' }}
            onChange={(value) => {
              setState({ remark: value })
            }}
          />
        </View>
      </View>
      <View className='realname-bottom'>
        <View className='realname-bottom-btn'>
          <Button block type='primary' size='large' className='foot-btn' onClick={submit}>
            下一步
          </Button>
        </View>
      </View>
    </>
  )
}
