import { Button, Icon } from '@nutui/nutui-react-taro'
import { Input, View } from '@tarojs/components'
import { navigateBack, showToast, useDidShow, useRouter } from '@tarojs/taro'
import { useCallback, useState } from 'react'
import useSetState from '@/hooks/useSetState'
import classNames from 'classnames'
import NoData from '@/components/NoData'
import Dialog from '@/components/Dialog'
import { pageHelperTaskItem, helperClockIn } from '@/api/attendance'
import storage from '@/utils/storage'
import './index.less'

export default () => {
  const [list, setList] = useState<any>([])
  const {
    params: { merchantTaskCode },
  } = useRouter()
  useDidShow(() => {
    pageHelperTaskItem({
      merchantTaskCode,
      helperCode: storage.get('helperCode'),
      page: 1,
      limit: 300,
    }).then((data) => {
      setList(data.list)
    })
  })
  const [info, seInfo] = useSetState<any>({})
  // 填写考勤弹窗
  const [dialogVisible, setDialogVisible] = useState(false)
  const confirm = async () => {
    console.log(info)
    if (!info.actualWorkload) {
      showToast({ title: '工时不能为0', icon: 'none' })
      return false
    }
    if (!/^[+]?\d+(\.5+([0]*)?)?$/.test(info.actualWorkload)) {
      showToast({ title: '工时最小单位为0.5小时', icon: 'none' })
      return false
    }
    if (info.actualWorkload > 24) {
      showToast({ title: '工时不能超过24小时', icon: 'none' })
      return false
    }
    const subData = {
      actualWorkload: Number(info.actualWorkload),
      helperCode: info.helperCode,
      helperTaskItemCode: info.helperTaskItemCode,
    }
    await helperClockIn(subData)
    showToast({
      title: '操作成功',
      icon: 'none',
      success() {
        setTimeout(() => {
          setDialogVisible(false)
          pageHelperTaskItem({
            merchantTaskCode,
            helperCode: storage.get('helperCode'),
            page: 1,
            limit: 300,
          }).then((data) => {
            setList(data.list)
          })
        }, 1000)
      },
    })
  }
  const onCancel = () => {
    console.log('cancel')
    setDialogVisible(false)
  }
  const goDetail = useCallback((item) => {
    seInfo({ ...item, actualWorkload: 0 })
    setDialogVisible(true)
  }, [])

  const back = () => {
    navigateBack()
  }
  const inputChange = (e) => {
    seInfo({ actualWorkload: e.detail.value })
  }
  return (
    <>
      <View className='chcecklist-wrap'>
        {list.length > 0 ? (
          list.map((item, index) => (
            <View key={index} className='checklist-item'>
              <View className='checklist-item-time'>{item.serviceDate?.split(' ')[0]}</View>
              <View className='checklist-item-content'>
                <View className='checklist-item-content-main'>{item.actualWorkload}</View>
                <View className='checklist-item-content-remark'>小时</View>
                {item.helperTaskItemStatus !== 30 && item.helperTaskItemStatus !== 50 && (
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
                  warn: item.helperTaskItemStatus === 20,
                  error: item.helperTaskItemStatus === 40,
                  success: item.helperTaskItemStatus === 10,
                })}
              >
                {item.helperTaskItemStatusName}
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
        title={info.serviceDate?.split(' ')[0] + '服务工时'}
        visible={dialogVisible}
        onConfirm={confirm}
        onCancel={onCancel}
      >
        <View className='kq-input-wrap'>
          <Input
            className='kq-input'
            type='digit'
            onInput={inputChange}
            // onBlur={inputChange}
            placeholder='请输入工时'
            maxlength={4}
            value={info.actualWorkload}
          />
          <View className='kq-danwei'>小时</View>
        </View>
      </Dialog>
    </>
  )
}
