import { View } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'
import useSetState from '@/hooks/useSetState'
import { showToast, navigateBack, switchTab, useRouter } from '@tarojs/taro'
import { Checkbox, Field, Textarea } from '@/package'
import { baseUrl } from '@/utils/http/index'
import { userSaveHelperInfo, realNameIdentify } from '@/api/info'
import Upload from '@/components/Upload'
import { useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from '@/hooks/useStore'
import { setActiveVisible } from '@/store/tabbar'
import storage from '@/utils/storage'
import { listJobType } from '@/api/sys'
import './index.less'

export default () => {
  const [typeStatus, setTypeStatus] = useState<any>([])
  const {
    params: { from },
  } = useRouter()
  useEffect(() => {
    listJobType({}).then((data) => {
      data.forEach((item) => {
        item.value = item.dictCode
        item.label = item.dictName
      })
      setTypeStatus(data)
    })
  }, [])
  const dispatch = useAppDispatch()
  const toHome = () => {
    switchTab({ url: '/pages/index/index' })
    dispatch(setActiveVisible(0))
  }
  const onStatusChange = (active: string[]) => {
    setState({
      jobTypeList: active,
      jobTypeNameList: typeStatus
        .filter((item) => active.includes(item.value))
        .map((item2) => item2.label),
    })
  }
  const [validateResult, setValidateResult] = useState(false)
  const [errorMsg, setErrorMsg] = useState(false)
  const [state, setState] = useSetState({
    sex: '', // 性别
    name: '', // 姓名
    idNum: '', // 身份证号
    nation: '', // 国籍
    address: '', // 地址
    birth: '', // 生日
    bankCardId: '', // 银行卡号
    bankCardPhone: '', // 银行卡预留手机
    jobTypeList: [], // 擅长工作
    jobTypeNameList: [], // 擅长工作name
    jobAge: '', // 工龄
    emergencyContact: '', // 紧急联系人
    emergencyContactPhone: '', // 紧急联系人电话
    profile: '', // 个人优势
    attachmentList: [], // 身份证正面
    attachmentList2: [], // 身份证反面
  })
  const imgLen = useMemo(() => {
    return state.attachmentList.length + state.attachmentList2.length
  }, [state.attachmentList, state.attachmentList2])

  useEffect(() => {
    if (imgLen === 2) {
      realNameIdentify({
        faceAttachmentId: state.attachmentList[0].attachmentId,
        nationalAttachmentId: state.attachmentList2[0].attachmentId,
      }).then((data) => {
        if (data?.idNum) {
          setState({
            sex: data.sex,
            name: data.name,
            idNum: data.idNum,
            address: data.address,
            nation: data.nation,
            birth: data.birth,
          })
          setValidateResult(true)
        } else {
          setValidateResult(false)
          setErrorMsg(data.errorMsg)
        }
      })
    }
  }, [imgLen])
  const submit = async () => {
    console.log(state)
    if (state.attachmentList.length === 0) {
      // 身份证正面
      showToast({ title: '请上传身份证正面', icon: 'none' })
    } else if (state.attachmentList2.length === 0) {
      // 身份证反面
      showToast({ title: '请上传身份证反面', icon: 'none' })
    } else if (!validateResult) {
      // 身份证是否校验通过
      showToast({ title: '请上传正确的身份证照片', icon: 'none' })
    } else if (!state.bankCardId || state.bankCardId.length < 13) {
      // 银行卡
      showToast({ title: '请输入正确的银行卡号', icon: 'none' })
    } else if (!/^1\d{10}$/.test(state.bankCardPhone)) {
      // 银行卡预留手机
      showToast({ title: '请输入正确的银行卡预留手机号', icon: 'none' })
    } else if (!state.jobTypeList[0]) {
      // 擅长工作
      showToast({ title: '请选择擅长工作', icon: 'none' })
    } else if (!state.jobAge) {
      // 工龄
      showToast({ title: '请输入工龄', icon: 'none' })
    } else if (!/^[a-zA-Z\u4E00-\u9FA5]+$/.test(state.emergencyContact)) {
      // 紧急联系人
      showToast({ title: '请输入正确的紧急联系人', icon: 'none' })
    } else if (!/^1\d{10}$/.test(state.emergencyContactPhone)) {
      // 紧急联系人手机
      showToast({ title: '请输入正确的紧急联系人手机', icon: 'none' })
    } else if (state.emergencyContactPhone === state.bankCardPhone) {
      // 两个手机相同
      showToast({ title: '预留手机不能与紧急联系人手机相同', icon: 'none' })
    } else if (state.jobTypeList.length === 0) {
      // 擅长工作
      showToast({ title: '请选择擅长工作', icon: 'none' })
    } else {
      const subData = JSON.parse(JSON.stringify(state))
      subData.majorJobType = subData.jobTypeList[0]
      subData.majorJobTypeName = subData.jobTypeNameList[0]
      subData.faceAttachmentId = state.attachmentList[0].attachmentId
      subData.nationalAttachmentId = state.attachmentList2[0].attachmentId
      const data = await userSaveHelperInfo(subData)
      showToast({
        title: '实名认证成功',
        icon: 'none',
        success() {
          setTimeout(() => {
            storage.set('registerStatus', 2)
            storage.set('helperCode', data)
            if (from === 'login') {
              toHome()
            } else {
              navigateBack()
            }
          }, 1000)
        },
      })
    }
  }
  return (
    <>
      <View className='realname-wrap'>
        <View className='upload-tit'>请拍摄并上传身份证照</View>
        <View className='upload-wrap'>
          <View className='upload-item'>
            <Upload
              value={state.attachmentList}
              count={1}
              attachmentType='BG_ID_CARD'
              requestUrl={`${baseUrl.banggong}/attachment/upload`}
              className='md-upload'
              onChange={(fileList) => {
                setState({ attachmentList: fileList })
              }}
              footerHint='拍摄正面'
            ></Upload>
          </View>
          <View className='upload-item'>
            <Upload
              value={state.attachmentList2}
              attachmentType='BG_ID_CARD'
              count={1}
              requestUrl={`${baseUrl.banggong}/attachment/upload`}
              className='md-upload'
              onChange={(fileList) => {
                setState({ attachmentList2: fileList })
              }}
              footerHint='拍摄反面'
            ></Upload>
          </View>
        </View>
        {!validateResult && <View className='upload-error'>{errorMsg}</View>}
      </View>
      <View className='realname-wrap pb0'>
        {validateResult && (
          <Field
            name='sex'
            labelWidth='80'
            label='性别'
            placeholder='请输入性别'
            value={state.sex}
            inputAlign='right'
            readonly
          />
        )}

        {validateResult && (
          <Field
            name='name'
            labelWidth='80'
            label='姓名'
            placeholder='请输入姓名'
            value={state.name}
            inputAlign='right'
            readonly
          />
        )}
        {validateResult && (
          <Field
            name='idNum'
            labelWidth='80'
            label='身份证号码'
            placeholder='请输入身份证号码'
            value={state.idNum}
            inputAlign='right'
            readonly
          />
        )}
        <Field
          name='bankCardId'
          labelWidth='80'
          label='银行卡'
          placeholder='请输入银行卡'
          value={state.bankCardId}
          onChange={(e) => {
            setState({ bankCardId: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          textMaxLength={19}
          clear={false}
        />
        <Field
          name='bankCardPhone'
          labelWidth='120'
          label='银行卡预留手机号'
          placeholder='请输入银行卡预留手机号'
          value={state.bankCardPhone}
          onChange={(e) => {
            setState({ bankCardPhone: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          type='number'
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
          name='jobAge'
          labelWidth='120'
          label='工龄（年）'
          placeholder='请填写工作年限'
          value={state.jobAge}
          onChange={(e) => {
            setState({ jobAge: e ? e.detail.value : '' })
          }}
          max={70}
          inputAlign='right'
          type='digit'
          clear={false}
        />
        <Field
          name='emergencyContact'
          labelWidth='120'
          label='紧急联系人'
          placeholder='请输入紧急联系人'
          value={state.emergencyContact}
          onChange={(e) => {
            setState({ emergencyContact: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          textMaxLength={6}
          clear={false}
        />
        <Field
          name='emergencyContactPhone'
          labelWidth='120'
          label='紧急联系人电话'
          placeholder='请输入紧急联系人电话'
          value={state.emergencyContactPhone}
          onChange={(e) => {
            setState({ emergencyContactPhone: e ? e.detail.value : '' })
          }}
          inputAlign='right'
          type='number'
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
          <Textarea
            placeholder='请用几句话介绍自己吧，限200字'
            maxlength={200}
            className2='text-1'
            value={state.profile}
            style={{ fontSize: '12px', height: '120px' }}
            showCount
            onChange={(e) => {
              setState({ profile: e.detail.value })
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
