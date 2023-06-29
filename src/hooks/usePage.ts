import { useReachBottom, showLoading, hideLoading, showToast } from '@tarojs/taro'
import { useRef, useState } from 'react'

/*
 * 分页钩子，页面config.js 必须加上 enablePullDownRefresh: true
 */
export default function usePage(fn, opt?) {
  const option = {
    immediate: true,
    limit: 20,
    ...(opt || {}),
  }
  const [lists, setList] = useState([])
  const page = useRef(1) // 当前页
  const isLoading = useRef(false) // 防止fetchData多次执行执行
  const [formData, setFormData] = useState({})
  const isLast = useRef<boolean>(false) // 是否最后一页
  useReachBottom(() => {
    if (!opt.noUseReachBottom) {
      getData()
    }
  })
  // 下拉触发函数
  const getData = async () => {
    if (isLast.current) {
      return false
    }
    showLoading({ title: '数据加载中' })
    console.log({ limit: option.limit, page, ...formData }, '请求参数')
    const data = await fn({ limit: option.limit, page: page.current, ...formData })
    if (!data) {
      hideLoading()
      return false
    }
    if (data && data.list.length > 0) {
      if (data.list.length === option.limit) {
        page.current += 1
      } else {
        // 有数据但小于limit
        isLast.current = true
        if (page.current > 1) {
          showToast({
            title: '暂未更多数据',
            icon: 'none',
          })
        }
      }
      setList(lists.concat(data.list))
    } else {
      // 无数据
      isLast.current = true
      if (page.current > 1) {
        showToast({
          title: '暂未更多数据',
          icon: 'none',
        })
      }
    }
    hideLoading()
  }
  // 分页置为1
  const fetchData = async (form) => {
    isLast.current = false
    isLoading.current = false
    page.current = 1
    setList([])
    showLoading({ title: '数据加载中' })
    console.log({ limit: option.limit, page, ...form }, '请求参数2')
    const data = await fn({ limit: option.limit, page: 1, ...form })
    if (!data) {
      hideLoading()
      return false
    }
    if (data && data.list.length > 0) {
      if (data.list.length === option.limit) {
        if (!isLoading.current) {
          page.current += 1
          isLoading.current = true
        }
      } else {
        isLast.current = true
      }
      setList(data.list || [])
      setFormData(form)
    } else {
      // 无数据
      isLast.current = true
    }
    hideLoading()
  }

  return { lists, fetchData, getData }
}
