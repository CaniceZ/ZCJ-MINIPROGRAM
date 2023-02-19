import { useState, useMemo, useCallback, CSSProperties } from 'react'
import useAvailableViewHeight, { DeepArray } from '../../hooks/useAvailableViewHeight'

export interface ListType<T> {
  list: T[]
  total: number
}
type Options = {
  limit?: number
  selector?: string | DeepArray<string>
}

type Pagination = {
  page: number
  limit: number
  total: number
}

type ListViewReturnType<T> = {
  listData: T[]
  fetchData: (formData) => Promise<void>
  listViewProps: {
    style: CSSProperties
    loading: boolean
    hasMore: boolean
    noData: boolean
    pagination: Pagination
    onPullDownRefresh: () => Promise<void>
    onScrollToLower: () => Promise<void>
    [key: string]: any
  }
}

const useListView = <T = any>(
  fetcher: (params?: any) => Promise<ListType<T>>,
  options?: Options,
): ListViewReturnType<T> => {
  const [listData, setListData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [formData, setFormData] = useState({})
  const [noData, setNodata] = useState(false)
  const { selector = [] } = options || { selector: [] }
  const height = useAvailableViewHeight(selector)

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: options?.limit || 20,
    total: 0,
  })

  // 分页置为1
  const fetchData = useCallback(
    async (form) => {
      const { limit } = pagination
      const params = {
        page: 1,
        limit,
        ...form,
      }
      const { list, total = 0 } = await fetcher(params)
      if (total === 0) {
        setNodata(true)
      }
      setListData(list || [])
      setFormData(form)
      setPagination({
        ...pagination,
        page: 2,
        total,
      })
      setHasMore(list?.length === limit)
    },
    [pagination],
  )

  // 下拉刷新
  const onPullDownRefresh = useCallback(async () => {
    const { limit } = pagination
    setLoading(true)
    const params = {
      page: 1,
      limit,
    }
    const { list, total = 0 } = await fetcher(params)
    if (total === 0) {
      setNodata(true)
    }
    setPagination({
      ...pagination,
      page: 2,
      total,
    })
    setListData(listData.concat(list || []))
    setLoading(false)
    setHasMore(list?.length === limit)
  }, [listData, pagination])

  const onScrollToLower = useCallback(async () => {
    const { page, limit } = pagination
    if (!hasMore || loading) {
      return
    }
    setLoading(true)
    const params = {
      page: page,
      limit: limit,
      ...formData,
    }
    const { list, total = 0 } = await fetcher(params)
    if (total === 0) {
      setNodata(true)
    }
    setListData(listData.concat(list || []))
    setHasMore(list?.length === limit)
    setLoading(false)
    setPagination({
      ...pagination,
      page: ++pagination.page,
      total,
    })
  }, [pagination, hasMore, loading, formData, fetcher, listData])

  const listViewProps = useMemo(
    () => ({
      style: { height: height + 'px' },
      loading,
      hasMore,
      onPullDownRefresh,
      onScrollToLower,
      noData,
      pagination,
    }),
    [loading, hasMore, onPullDownRefresh, onScrollToLower, noData, height, pagination],
  )

  return { listData, fetchData, listViewProps }
}

export default useListView
