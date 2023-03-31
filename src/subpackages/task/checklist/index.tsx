import { Button, Icon } from '@nutui/nutui-react-taro'
import { Input, View } from '@tarojs/components'
import { navigateBack, showToast } from '@tarojs/taro'
import { useCallback, useState } from 'react'
import useSetState from '@/hooks/useSetState'
import classNames from 'classnames'
import NoData from '@/components/NoData'
import Dialog from '@/components/Dialog'
import './index.less'

export default () => {
  const listData = [
    { helperTaskItemCode: 123 },
    { helperTaskItemCode: 321 },
    { helperTaskItemCode: 234 },
  ]
  const [info, seInfo] = useSetState<any>({})
  // 填写考勤弹窗
  const [dialogVisible, setDialogVisible] = useState(false)
  const confirm = () => {
    console.log(info)
    if (!/^[+]?\d+(\.5+([0]*)?)?$/.test(info.workNum)) {
      showToast({ title: '工时最小单位为0.5小时', icon: 'none' })
      return false
    }
    const subData = {
      actualWorkload: info.workNum,
      helperCode: info.helperCode,
      helperTaskItemCode: info.helperTaskItemCode,
    }
    console.log(subData)
    setDialogVisible(false)
  }
  const onCancel = () => {
    console.log('cancel')
    setDialogVisible(false)
  }
  const goDetail = useCallback((item) => {
    seInfo(item)
    setDialogVisible(true)
  }, [])

  const back = () => {
    navigateBack()
  }
  const inputChange = (e) => {
    const num = Number(e.detail.value)
    console.log(num)
    seInfo({ workNum: num })
  }
  return (
    <>
      <View className='chcecklist-wrap'>
        {listData.length > 0 ? (
          listData.map((item, index) => (
            <View key={index} className='checklist-item'>
              <View className='checklist-item-time'>2024-02-24</View>
              <View className='checklist-item-content'>
                <View className='checklist-item-content-main'>5</View>
                <View className='checklist-item-content-remark'>小时</View>
                {index % 2 && (
                  <Icon
                    name='edit'
                    color='#4D8FFF'
                    size='14px'
                    onClick={() => {
                      goDetail(item)
                    }}
                  />
                )}
              </View>
              <View
                className={classNames('checklist-item-status', {
                  warn: index % 2,
                  error: index === 2,
                })}
              >
                已确认
              </View>
            </View>
          ))
        ) : (
          <NoData></NoData>
        )}
      </View>
      <View className='bg-bottom'>
        <View className='bg-bottom-btn'>
          <Button block type='primary' size='large' plain className='foot-btn' onClick={back}>
            返回任务详情页
          </Button>
        </View>
      </View>
      <Dialog
        title='2023-02-24服务工时'
        visible={dialogVisible}
        onConfirm={confirm}
        onCancel={onCancel}
      >
        <View className='kq-input-wrap'>
          <Input
            className='kq-input'
            type='digit'
            // onInput={inputChange}
            onBlur={inputChange}
            placeholder='请输入工时'
            value={info.workNum}
          />
          <View className='kq-danwei'>小时</View>
        </View>
      </Dialog>
    </>
  )
}
