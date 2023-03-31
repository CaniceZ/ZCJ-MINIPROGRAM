import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { FC, ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { Icon } from '@nutui/nutui-react-taro'
import storage from '@/utils/storage'
import { AcceptType, FileError, FileStatus } from './types'
import { isImageUrl } from './utils'
import { isArray } from '../../utils/is'
import './index.less'

export interface FileType
  extends Partial<Taro.chooseMedia.ChooseMedia>,
    Partial<Taro.chooseMessageFile.ChooseFile> {
  // status?: `${FileStatus}`
  progress?: number
  error?: string
  [key: string]: any
}
export type UploadProps = {
  /** 文件列表内容 */
  value: FileType[]
  /** 自定义className */
  className?: string
  /** 上传路径 */
  requestUrl: string
  /** 附件类型 */
  attachmentType: string
  /** 可上传文件类型，eg: ['image', 'video', 'messageFile'] */
  accept?: Array<keyof AcceptType>
  /** 最大可上传数量, 默认3 */
  count?: number
  /** 定义微信会话上传的类型，支持all、video、image、file */
  messageFileType?: Taro.chooseMessageFile.Option['type']
  /** 文件尺寸限制，格式为MB */
  sizeLimit?: number
  /** 只读, 默认false */
  readonly?: boolean
  /** 底部提示文案 */
  footerHint?: string | ReactNode
  /** 文件变化回调函数 */
  onChange?: (files) => void
}
const Upload: FC<Partial<UploadProps>> = (props) => {
  const {
    value = [],
    accept = ['image'],
    className,
    requestUrl,
    attachmentType,
    count = 3,
    sizeLimit,
    readonly = false,
    onChange,
    footerHint,
  } = props
  const fileList = useRef<FileType[]>([])
  const isInit = useRef<boolean>(false)
  useEffect(() => {
    if (isArray(value)) {
      if (value.length) {
        init()
      }
      fileList.current = [...value]
    }
  }, [value])
  // 初始化
  const init = useCallback(async () => {
    if (isInit.current) {
      return
    }
    const initArr: FileType[] = []
    isInit.current = true
    value.forEach((file) => {
      file.tempFilePath = file.fileUrl
      initArr.push(file)
    })
    onChange?.(initArr)
  }, [value])
  const beforeChoose = useCallback(() => {
    if (fileList.current.length === count) {
      Taro.showToast({
        title: `最多可上传${count}个！`,
        icon: 'none',
      })
      return Promise.reject()
    }
  }, [])
  const handlePreview = useCallback(
    async (current) => {
      const urls = value.filter((item) => isImageUrl(item)).map((e) => e.tempFilePath) as string[]
      Taro.previewImage({
        urls,
        current,
      })
    },
    [value],
  )
  const handleDel = useCallback((index: number) => {
    fileList.current.splice(index, 1)
    onChange?.(fileList.current)
  }, [])
  const chooseMedia = useCallback(async () => {
    const result = await Taro.chooseMedia({
      count: count - fileList.current.length,
      mediaType: accept as Taro.chooseMedia.Option['mediaType'],
      sizeType: ['compressed'],
    })
    // const { tempFiles } = result
    // // 抹平api回参差异
    // ;(tempFiles as FileType[]).forEach((file) => {
    //   file.name = (file.tempFilePath as string).split('/').pop() as string
    //   file.path = file.tempFilePath
    //   file.type = file.fileType
    // })
    chooseSuccess(result)
  }, [])
  const chooseSuccess = useCallback((result) => {
    const { tempFiles } = result
    // fileList.current = fileList.current.concat(tempFiles)
    beforeUpload(tempFiles)
    upload(tempFiles)
    onChange?.(fileList.current)
  }, [])
  const upload = useCallback(async (tempFiles) => {
    // 过滤出等待上传的文件
    const files = tempFiles.filter((file) => file.status === FileStatus.Wait)
    // 如果不存在等待上传的文件则返回
    if (!files.length) return
    // 拿到获取上传token的参数
    tempFiles.forEach((file) => {
      const { tempFilePath } = file
      const uploadTask = Taro.uploadFile({
        url: requestUrl as string,
        header: {
          token: storage.get('token'),
        },
        formData: {
          fileSize: file.size,
          attachmentType: attachmentType,
        },
        filePath: tempFilePath,
        name: 'file', // 必须填file。
        success(res) {
          const response = res.data && JSON.parse(res.data)
          if (response.succeed) {
            file.attachmentId = response.data.attachmentId
            file.filePath = response.data.filePath
            file.fileUrl = response.data.fileUrl
            file.stsUrl = response.data.stsUrl
            file.status = FileStatus.Done
            fileList.current = fileList.current.concat(file)
            onChange?.(fileList.current)
          } else {
            file.status = FileStatus.Error
            file.error = FileError.UploadFail
            onChange?.(fileList.current)
            Taro.showToast({
              title: response.msg || '上传超时',
              icon: 'none',
            })
          }
        },
        fail() {
          // 如果上传出错
          uploadTask.abort()
          file.status = FileStatus.Error
          file.error = FileError.UploadFail
          onChange?.(fileList.current)
        },
      })
      uploadTask.progress((res) => {
        file.status = FileStatus.Uploading
        file.progress = res.progress
        onChange?.(fileList.current)
      })
    })
  }, [])
  const beforeUpload = useCallback((files) => {
    files.forEach((file) => {
      const fileSize = file.size / 1024 / 1024
      file.status = FileStatus.Wait
      if (sizeLimit && fileSize > sizeLimit) {
        file.status = FileStatus.Error
        file.error = FileError.OverSizeLimit
      }
    })
  }, [])
  const handleClick = async () => {
    await beforeChoose()
    chooseMedia()
  }
  const uploadClassName = useMemo(() => classNames('wy-upload', className), [])
  return (
    <View className={uploadClassName}>
      <View className='wy-upload-list'>
        {value.map((item, index) => (
          <View className='wy-upload-list-item' key={item.tempFilePath}>
            <Image
              className='wy-upload-picture-item__file-image'
              src={item.tempFilePath as string}
              mode='aspectFill'
              lazyLoad
              onClick={() => handlePreview(item.tempFilePath)}
            />
            <View className='del-bar' onClick={() => handleDel(index)}>
              <Icon name='del' size={16}></Icon>
              <Text>删除</Text>
            </View>
          </View>
        ))}
        {value.length < count && !readonly && (
          <View className='wy-upload-list-item add-item' onClick={handleClick}>
            <Icon name='uploader' size={12}></Icon>
          </View>
        )}
      </View>
      {footerHint && <View className='wy-upload-footer'>{footerHint}</View>}
    </View>
  )
}
export default Upload
