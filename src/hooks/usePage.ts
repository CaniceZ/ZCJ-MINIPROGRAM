import { useReachBottom, showLoading, hideLoading, showToast } from '@tarojs/taro'
import { useRef, useState } from 'react'

export default function usePage(fn, opt?) {
  const option = {
    immediate: true,
    limit: 20,
    ...(opt || {}),
  }
  const [lists, setList] = useState([])
  const [page, setPage] = useState(1)
  const [formData, setFormData] = useState({})
  const isLast = useRef<boolean>(false)
  useReachBottom(() => {
    console.log('onReachBottom')
    getData()
  })
  const getData = async () => {
    if (isLast.current) {
      return false
    }
    showLoading({ title: '数据加载中' })
    console.log({ limit: option.limit, page, ...formData }, '请求参数')
    const { succeed, data } = await fn({ limit: option.limit, page, ...formData })
    if (!data) {
      hideLoading()
      return false
    }
    if (data && data.length > 0) {
      if (data.length === option.limit) {
        setPage((oldI) => oldI + 1)
      } else {
        isLast.current = true
        if (page > 1) {
          showToast({
            title: '暂未更多数据',
            icon: 'none',
          })
        }
      }
      if (succeed) {
        setList(lists.concat(data))
      }
    }
    hideLoading()
  }
  // 分页置为1
  const fetchData = async (form) => {
    isLast.current = false
    setPage(1)
    showLoading({ title: '数据加载中' })
    console.log({ limit: option.limit, page, ...form }, '请求参数2')
    const { succeed, data } = await fn({ limit: option.limit, page: 1, ...form })
    if (!data) {
      hideLoading()
      return false
    }
    if (data && data.length > 0) {
      if (data.length === option.limit) {
        setPage((oldI) => oldI + 1)
      } else {
        isLast.current = true
        if (page > 1) {
          showToast({
            title: '暂未更多数据',
            icon: 'none',
          })
        }
      }
      if (succeed) {
        setList(data || [])
        setFormData(form)
      }
    }
    hideLoading()
  }

  return { lists, fetchData }
}
