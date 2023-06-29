import QrcodePopup from '@/components/QrcodePopup'
import { Button, Icon } from '@nutui/nutui-react-taro'
import { View } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { showToast } from '@tarojs/taro'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import { hms2hm, spliceArr, ymd2md } from '@/utils/utils'
import {
  listCurrentHelperPartTimePlan,
  savePartTimePlan,
  listAllPartTimeShift,
  checkHelperSubscribeWSA,
} from '@/api/plan'
import dayjs from 'dayjs'
import './index.less'

export default () => {
  useEffect(() => {
    listCurrentHelperPartTimePlan({}).then((data) => {
      setListData(spliceArr(data, 7))
    })
    listAllPartTimeShift({}).then((data) => {
      setAreaList(data)
    })
  }, [])
  const weekList = ['一', '二', '三', '四', '五', '六', '日']
  const [curIndex, setCurIndex] = useState(0)
  const [areaList, setAreaList] = useState<any[]>([
    { text: '早班', value: '6:00-9:59' },
    { text: '中班', value: '6:00-9:59' },
    { text: '晚班', value: '6:00-9:59' },
    { text: '夜班', value: '6:00-9:59' },
  ])
  const [listData, setListData] = useImmer<any[]>([])
  const isDisabled = (item2) => {
    return item2.shiftEndTime > item2.shiftStartTime
      ? dayjs().isAfter(dayjs(item2.partTimeDate + ' ' + item2.shiftEndTime))
      : dayjs().isAfter(dayjs(item2.partTimeDate + ' ' + item2.shiftEndTime).add(1, 'day'))
  }
  // 公众号二维码
  const [isShow, setIsShow] = useState(false)
  const setPre = () => {
    if (curIndex !== 0) {
      let tmp = curIndex
      setCurIndex(tmp - 1)
    }
  }
  const setNext = () => {
    if (curIndex !== listData.length - 1) {
      let tmp = curIndex
      setCurIndex(tmp + 1)
    }
  }
  const handleChange = (index, index2, item2) => {
    if (
      item2.shiftEndTime > item2.shiftStartTime
        ? dayjs().isAfter(dayjs(item2.partTimeDate + ' ' + item2.shiftEndTime))
        : dayjs().isAfter(dayjs(item2.partTimeDate + ' ' + item2.shiftEndTime).add(1, 'day'))
    ) {
      return false
    }
    setListData((draft) => {
      if (item2.planStatus === 10) {
        draft[curIndex][index].partTimePlanList[index2].planStatus = 20
      } else {
        draft[curIndex][index].partTimePlanList[index2].planStatus = 10
      }
    })
  }
  const dayClick = (index3) => {
    setListData((draft) => {
      draft[curIndex][index3].partTimePlanList = draft[curIndex][index3].partTimePlanList.map(
        (item) => {
          return {
            ...item,
            planStatus: isDisabled(item) ? item.planStatus : 20,
          }
        },
      )
    })
  }
  const submit = async () => {
    let data = []
    for (let index = 0; index < listData.flat().length; index++) {
      const element = listData.flat()[index]
      data = data.concat(...element.partTimePlanList)
    }
    await savePartTimePlan({ partTimePlanList: data })
    listCurrentHelperPartTimePlan({}).then((data2) => {
      setListData(spliceArr(data2, 7))
    })
    showToast({
      title: '设置成功',
      icon: 'none',
      success() {
        setTimeout(() => {
          checkHelperSubscribeWSA({}).then((res) => {
            if (!res) setIsShow(true)
          })
        }, 500)
      },
    })
  }
  return (
    <>
      <View className='plan-wrap'>
        <View className='wrap-top'>
          <View
            className={classNames('opt-btn', {
              disabled: curIndex === 0,
            })}
            onClick={setPre}
          >
            上周
          </View>
          <View className='wrap-top-title'>
            <View className='top-title1'>可兼职时间表</View>
            <View className='top-title2'>
              |{' '}
              {listData.length > 0 &&
                ymd2md(listData[curIndex][0]?.partTimeDate) +
                  ' 至 ' +
                  ymd2md(listData[curIndex][6]?.partTimeDate)}
            </View>
          </View>
          <View
            className={classNames('opt-btn', {
              disabled: curIndex === listData.length - 1,
            })}
            onClick={setNext}
          >
            下周
          </View>
        </View>
        <View className='date-title'>
          <View className='date-title-left'>
            <View>
              {parseInt(
                listData.length > 0 && listData[curIndex][0]?.partTimeDate?.split('-')[1],
              ) || '-'}
            </View>
            <View>月</View>
          </View>
          <View className='date-title-right'>
            <View className='date-week'>
              {weekList?.map((item, index3) => (
                <View
                  key={item}
                  className='date-week-item'
                  onClick={() => {
                    dayClick(index3)
                  }}
                >
                  {item}
                </View>
              ))}
            </View>
            <View className='date-days'>
              {listData[curIndex]?.map((item, index3) => (
                <View
                  key={item.partTimeDate}
                  className='date-days-item'
                  onClick={() => {
                    dayClick(index3)
                  }}
                >
                  {item.partTimeDate?.split('-')[2] === '01'
                    ? parseInt(item.partTimeDate?.split('-')[1]) + '月'
                    : item.partTimeDate?.split('-')[2]}
                </View>
              ))}
            </View>
          </View>
        </View>
        <View className='plan-content'>
          <View className='plan-content-left'>
            {areaList.map((item) => (
              <View key={item.shiftName} className='area-item'>
                <View className='area-item-text'>{item.shiftName}</View>
                <View className='area-item-value'>
                  {hms2hm(item.shiftStartTime)}-{hms2hm(item.shiftEndTime)}
                </View>
              </View>
            ))}
          </View>
          <View className='plan-content-right'>
            {listData[curIndex]?.map((item, index) => (
              <View key={index} className='plan-item'>
                {item?.partTimePlanList?.map((item2, index2) => (
                  <View
                    key={index2}
                    className={classNames('plan-item-unit', {
                      disabled: isDisabled(item2),
                    })}
                    onClick={() => {
                      handleChange(index, index2, item2)
                    }}
                  >
                    <Icon
                      name={item2.planStatus === 10 ? 'check-normal' : 'checked'}
                      size='18px'
                      color={item2.planStatus == 20 && !isDisabled(item2) ? '#4D8FFF' : '#BCBEC2'}
                    ></Icon>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View className='desc1'>说明：</View>
        <View className='desc2'>
          勾选按钮代表您该时段可以做兼职，我们将会按照您可以做兼职的时间为您推荐合适的订单
        </View>
        <View className='realname-bottom'>
          <View className='realname-bottom-btn'>
            <Button block type='primary' size='large' className='foot-btn' onClick={submit}>
              确认保存
            </Button>
          </View>
        </View>
        {/* 公众号二维码 */}
        <QrcodePopup
          visible={isShow}
          type='gzh'
          subText='您的专属任务信息将用公众号推送的形式通知给您，请您点击关注公众号，以免错过合适工作'
          onClose={() => {
            setIsShow(false)
          }}
        ></QrcodePopup>
      </View>
    </>
  )
}
