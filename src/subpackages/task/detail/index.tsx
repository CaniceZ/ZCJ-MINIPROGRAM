import { View, Text, Image } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { Button, Swiper, SwiperItem, Divider, Tag } from '@nutui/nutui-react-taro'
import { useState, useEffect, useCallback } from 'react'
import TaskItem from '@/components/TaskItem'
import './index.less'

export default () => {
  const [initPage1] = useState(0)
  const [list, setList] = useState<string[]>([])
  useEffect(() => {
    setTimeout(() => {
      const arr: string[] = [
        'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
        'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
        'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
        'https://storage.360buyimg.com/jdc-article/fristfabu.jpg',
      ]
      setList(arr)
    }, 1000)
  }, [])
  const listData = [{ a: 1 }, { a: 2 }]
  const goDetail = useCallback(() => {
    navigateTo({ url: '/subpackages/task/checklist/index' })
  }, [])
  return (
    <View className='taskdetail-wrap'>
      {/* 完成情况 */}
      <View className='task-deatil-wrap task-detail-complete'>
        <View className='task-detail-complete-top'>
          <View className='task-detail-complete-top-left'>
            <View>完成房间量（间）</View>
            <View className='task-detail-complete-top-num'>
              <View className='number'>10</View>
              <View className='status'>
                <Tag className='tag' color='#FA2400' plain>
                  考勤异常
                </Tag>
              </View>
            </View>
          </View>
          <View className='task-detail-complete-top-right' onClick={goDetail}>
            查看记录&gt;
          </View>
        </View>
        <View className='task-detail-complete-bottom'>
          <View className='task-detail-complete-bottom-item'>
            <View className='task-detail-complete-bottom-label'>已出勤天数（天）</View>
            <View className='task-detail-complete-bottom-value'>2</View>
          </View>
          <View className='task-detail-complete-bottom-item'>
            <View className='task-detail-complete-bottom-label'>总收入（元）</View>
            <View className='task-detail-complete-bottom-value'>200</View>
          </View>
        </View>
      </View>
      {/* 基本信息 */}
      <View className='taskdetail-base task-deatil-wrap'>
        <View className='taskdetail-base-title'>小炳胜</View>
        <View className='taskdetail-base-time'>2023-02-23 至 2023-02-29 共6天 | 距您19公里</View>
        <View className='taskdetail-base-time'>上班时间：9:00-18:00</View>
        <View className='taskdetail-base-time'>
          到岗时间：<Text className='red'>8:00</Text>
        </View>
        <View className='taskdetail-base-time'>
          报名人数：<Text className='red'>1</Text>/5
        </View>
        <View className='taskdetail-base-bottom'>
          <View className='taskdetail-base-bottom-left'>
            <View className='form-text-item'>
              <View className='form-text-label'>联系人：</View>
              <View className='form-text-value'>陈小姐</View>
            </View>
            <View className='form-text-item'>
              <View className='form-text-label'>地址：</View>
              <View className='form-text-value'>
                广东省广州市天河区天河路218号天环PARC CENTRALB25
              </View>
            </View>
          </View>
          <View className='taskdetail-base-bottom-right'>
            <View>导航</View>
            <View>电话</View>
          </View>
        </View>
      </View>
      {/* 价格信息 */}
      <View className='taskdetail-price task-deatil-wrap'>
        {true ? (
          <View className='taskdetail-price-top'>
            <View className='taskdetail-top-item'>
              <View className='taskdetail-top-item-top'>
                <Text className='red'>¥20</Text>/小时
              </View>
              <View className='taskdetail-top-item-bottom'>时薪</View>
            </View>
            <View className='taskdetail-top-item'>
              <View className='taskdetail-top-item-top'>
                <Text className='red'>30 </Text>小时
              </View>
              <View className='taskdetail-top-item-bottom'>预估总工时</View>
            </View>
          </View>
        ) : (
          <View className='taskdetail-price-top'>
            <View className='taskdetail-top-item'>
              <View className='taskdetail-top-item-top'>
                <Text className='red'>¥7</Text>/间
              </View>
              <View className='taskdetail-top-item-bottom'>单价</View>
            </View>
            <View className='taskdetail-top-item'>
              <View className='taskdetail-top-item-top'>
                <Text className='red'>30 </Text>间
              </View>
              <View className='taskdetail-top-item-bottom'>保底房量</View>
            </View>
            <View className='taskdetail-top-item'>
              <View className='taskdetail-top-item-top'>
                <Text className='red'>45 </Text>间
              </View>
              <View className='taskdetail-top-item-bottom'>最高房量</View>
            </View>
          </View>
        )}
        <View className='taskdetail-price-bottom'>
          <View className='taskdetail-bottom-top'>
            <Text className='red'>¥600 </Text>/小时
          </View>
          <View className='taskdetail-bottom-bottom'>预估收入</View>
        </View>
      </View>
      {/* 商家备注 */}
      <View className='shop-remark task-deatil-wrap'>
        <View className='shop-remark-title'>商家备注</View>
        <View className='shop-remark-content'>
          包午餐、晚餐，工作时间不能玩手机；工作要求有服务员经验，性格开朗，飞机勿扰
        </View>
      </View>
      {/* 轮播图 */}
      <View className='taskdetail-swiper'>
        <Swiper
          height='220'
          paginationColor='#426543'
          autoPlay='3000'
          initPage={initPage1}
          paginationVisible
        >
          {list.map((item) => {
            return (
              <SwiperItem key={item}>
                <Image className='swiper-img' src={item} />
              </SwiperItem>
            )
          })}
        </Swiper>
      </View>
      {/* 任务推荐 */}
      <View className='task-deatil-recommend'>
        <Divider
          className='task-deatil-recommend-text'
          styles={{ color: '#ccc', borderColor: '#ccc', padding: '0 30px' }}
        >
          任务推荐
        </Divider>
        {listData.map((_, index) => (
          <TaskItem key={index} index={index}></TaskItem>
        ))}
      </View>
      {/* 报名信息 */}
      <View className='task-deatil-wrap'>
        <View className='task-detail-sign-item'>
          <View className='task-detail-sign-label'>任务号</View>
          <View className='task-detail-sign-value'>ST20230322001001</View>
        </View>
        <View className='task-detail-sign-item'>
          <View className='task-detail-sign-label'>报名时间</View>
          <View className='task-detail-sign-value'>2023-03-22 09:02:56</View>
        </View>
      </View>
      <View className='task-deatil-bottom'>
        <View className='task-deatil-bottom-btn'>
          <Button block type='info' disabled={false}>
            立刻报名
          </Button>
        </View>
        <View className='add-wx'>添加微信</View>
      </View>
    </View>
  )
}
