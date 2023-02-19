import { View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { ConfigContext } from '../config-provider'
import Popup from '../popup'
import { useBoolean } from '../../hooks'
import { isArray } from '../../utils/is'
import { AcceptType, FileError, FileStatus, FieldMaps } from './types'
import { isImageUrl, extname } from './utils'

/** 文件类型 */
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
  /** 可上传文件类型，eg: ['image', 'video', 'messageFile'] */
  accept?: Array<keyof AcceptType>
  /** 最大可上传数量, 默认9 */
  count?: number
  /** 定义微信会话上传的类型，支持all、video、image、file */
  messageFileType?: Taro.chooseMessageFile.Option['type']
  /** 根据文件拓展名过滤，仅 messageFileType==file 时有效。每一项都不能是空字符串。默认不过滤。 */
  extension?: Array<string>
  /** 文件尺寸限制，格式为MB */
  sizeLimit?: number
  /** 文件分类编码 */
  categoryCode?: string
  /** 只读, 默认false */
  readonly?: boolean
  /** 是否需要走加密逻辑, 默认false */
  isPrivate?: boolean
  /** 文件字段映射关系, 可部分覆盖 */
  fieldMaps?: Partial<FieldMaps>
  /** 上传列表的内建样式，支持2种基本样式 text, picture */
  listType?: 'text' | 'picture'
  /** 头部插槽 */
  headerSlot?: string | ReactNode
  /** 底部插槽 */
  footerSlot?: string | ReactNode
  /** 头部提示文案 */
  headerHint?: string | ReactNode
  /** 底部提示文案 */
  footerHint?: string | ReactNode
  /** 是否是大宗旧附件， 走旧解密接口 */
  isBciscm?: boolean
  /** 文件变化回调函数 */
  onChange?: (files) => void
}

const Upload: FC<Partial<UploadProps>> = (props) => {
  const {
    value = [],
    className,
    accept = ['image'],
    count = 9,
    extension,
    messageFileType,
    sizeLimit,
    categoryCode,
    readonly = false,
    isPrivate = false,
    fieldMaps,
    listType = 'picture',
    headerSlot,
    footerSlot,
    headerHint,
    footerHint,
    isBciscm = false,
    onChange,
  } = props
  const [visible, { setFalse: hidePopup, setTrue: showPopup }] = useBoolean(false)
  const fileList = useRef<FileType[]>([])
  const isInit = useRef<boolean>(false)
  const { uploadOptions } = useContext(ConfigContext)

  // 初始化
  const init = useCallback(async () => {
    if (isInit.current) {
      return
    }
    isInit.current = true
    const initArr: FileType[] = []
    // 如果是加密,先解密拿到真实图片地址,否则直接取后端返回的path
    if (isPrivate) {
      const paths = value.map((e) => e[mergedFieldMaps.path])
      // 兼容大宗上传逻辑, 否则是走sys逻辑
      if (isBciscm) {
        for (let index in paths) {
          // @ts-ignore
          const url = await uploadOptions?.getBciscmPrivateUrl(paths[index])
          value[index].tempFilePath = url
        }
      } else {
        if (!uploadOptions?.getPrivateUrls) {
          console.warn('[props error] The getPrivateUrls prop is required')
          return
        }
        let res = await uploadOptions?.getPrivateUrls({
          categoryCode: categoryCode,
          urls: paths.join(','),
        })
        value.forEach((file, index) => {
          file.tempFilePath = res.urls[index]
          initArr.push(file)
        })
      }
    } else {
      value.forEach((file) => {
        file.tempFilePath = file[mergedFieldMaps.path] || file.tempFilePath || file.path
        initArr.push(file)
      })
    }
    onChange?.(initArr)
  }, [value])

  useEffect(() => {
    if (isArray(value)) {
      if (value.length) {
        init()
      }
      fileList.current = [...value]
    }
  }, [value])

  const mergedFieldMaps = useMemo<FieldMaps>(() => {
    return {
      id: 'id',
      name: 'fileName',
      size: 'fileSize',
      path: 'filePath',
      type: 'fileType',
      ...fieldMaps,
    }
  }, [])

  const uploadClassName = useMemo(() => classNames('ygp-upload', className), [listType])

  const beforeChoose = useCallback(() => {
    if (fileList.current.length === count) {
      Taro.showToast({
        title: `最多可上传${count}个！`,
        icon: 'none',
      })
      return Promise.reject()
    }
  }, [])

  const handleClick = useCallback(async () => {
    await beforeChoose()
    // 如果只接受图片类型，直接chooseMedia
    if (accept?.includes('messageFile')) {
      showPopup()
    } else {
      chooseMedia()
    }
  }, [accept])

  const chooseMedia = useCallback(async () => {
    const result = await Taro.chooseMedia({
      count,
      mediaType: accept as Taro.chooseMedia.Option['mediaType'],
    })
    const { tempFiles } = result
    // 抹平api回参差异
    ;(tempFiles as FileType[]).forEach((file) => {
      file.name = (file.tempFilePath as string).split('/').pop() as string
      file.path = file.tempFilePath
      file.type = file.fileType
    })
    chooseSuccess(result)
  }, [])

  const chooseMessageFile = useCallback(async () => {
    const result = await Taro.chooseMessageFile({
      type: messageFileType,
      count,
      extension,
    })
    const { tempFiles } = result
    ;(tempFiles as FileType[]).forEach((file) => {
      file.tempFilePath = file.path
    })
    chooseSuccess(result)
  }, [])

  const chooseSuccess = useCallback((result) => {
    const { tempFiles } = result
    fileList.current = fileList.current.concat(tempFiles)
    beforeUpload(tempFiles)
    upload(tempFiles)
    onChange?.(fileList.current)
  }, [])

  const handleDel = useCallback((index: number) => {
    fileList.current.splice(index, 1)
    onChange?.(fileList.current)
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

  const upload = useCallback(async (tempFiles) => {
    if (!uploadOptions?.getTokens) {
      console.warn('[props error] The getTokens prop is required')
      return
    }
    // 过滤出等待上传的文件
    const files = tempFiles.filter((file) => file.status === FileStatus.Wait)
    // 如果不存在等待上传的文件则返回
    if (!files.length) return
    // 拿到获取上传token的参数
    const list = files.map((file) => ({
      categoryCode,
      filename: file.name,
    }))
    uploadOptions
      ?.getTokens({
        list,
      })
      .then((uploadTokens) => {
        tempFiles.forEach((file) => {
          const { name, path } = file
          const res = uploadTokens[name]
          const { uploadToken, fullname, openDomain } = res
          const uploadTask = Taro.uploadFile({
            url: `https://upload-z2.qiniup.com`,
            // header,
            filePath: path,
            name: 'file', // 必须填file。
            formData: {
              key: fullname,
              token: uploadToken,
            },
            success() {
              const fullPath = `${openDomain}/${fullname}` // 拼接完整路径
              file[mergedFieldMaps.name] = file.name
              file[mergedFieldMaps.type] = file.type
              file[mergedFieldMaps.size] = file.size
              file[mergedFieldMaps.path] = isPrivate ? fullname : fullPath
              file.res = res
              file.status = FileStatus.Done
              onChange?.(fileList.current)
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
      })
      .catch(() => {
        tempFiles.forEach((file) => {
          file.status = FileStatus.Error
          file.error = FileError.UploadFail
        })
        onChange?.(fileList.current)
      })
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

  const handleFilePreview = useCallback((path) => {
    const suffix = extname(path)
    // pdf可预览， 其它类型的文件交互待完善
    if (suffix === '.pdf') {
      Taro.downloadFile({
        url: path,
        success: function (res) {
          const filePath = res.tempFilePath
          Taro.openDocument({
            filePath: filePath,
          })
        },
      })
    }
  }, [])

  const renderPictureList = useCallback(() => {
    const nodeList: ReactNode[] = []
    value?.map((item, index) => {
      nodeList.push(
        <View
          className='ygp-upload-picture-item ygp-upload-picture-item__file'
          key={item[mergedFieldMaps.name] || item.name}
        >
          {isImageUrl(item) ? (
            <Image
              className='ygp-upload-picture-item__file-image'
              src={item.tempFilePath as string}
              mode='aspectFill'
              lazyLoad
              onClick={() => handlePreview(item.tempFilePath)}
            />
          ) : (
            <Image
              className='ygp-upload-picture-item__icon'
              src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/attchment.png'
              onClick={() => handleFilePreview(item.tempFilePath)}
            />
          )}

          {!readonly && (
            <View
              className='ygp-upload-picture-item__file-del'
              onClick={() => handleDel(index)}
            ></View>
          )}
          {/* 如果上传出错 */}
          {item.error && (
            <View className='ygp-upload-picture-item__overlay'>
              <Text>{item.error}</Text>
            </View>
          )}
          {/* 上传中 */}
          {item.status === FileStatus.Uploading && (
            <View className='ygp-upload-picture-item__overlay'>
              <Text>{item.progress}%</Text>
            </View>
          )}
        </View>,
      )
    })

    if (!readonly) {
      nodeList.push(
        <View
          key='plus'
          className='ygp-upload-picture-item ygp-upload-picture-item__plus'
          onClick={handleClick}
        ></View>,
      )
    }
    return nodeList
  }, [value, handleClick, readonly])

  const getIcon = useCallback((item) => {
    if (isImageUrl(item)) {
      return 'https://qiniu-fe.yigongpin.com/ygp-taro-react-design/upload-img-icon.png'
    }
    let suffix = extname(item.tempFilePath)
    if (suffix === '.pdf') {
      return 'https://qiniu-fe.yigongpin.com/ygp-taro-react-design/attachment-pdf-icon.png'
    }
    return 'https://qiniu-fe.yigongpin.com/ygp-taro-react-design/upload-other-icon.png'
  }, [])

  const renderTextList = useCallback(() => {
    const nodeList: ReactNode[] = []
    value?.map((item) => {
      nodeList.push(
        <View key={item[mergedFieldMaps.name] || item.name} className='ygp-upload-text-item'>
          <Image className='ygp-upload-text-item__icon' src={getIcon(item)} />
          <View
            className='ygp-upload-text-item__title'
            onClick={() => {
              if (isImageUrl(item)) {
                handlePreview(item.tempFilePath)
              } else {
                handleFilePreview(item.tempFilePath)
              }
            }}
          >
            {item[mergedFieldMaps.name] || item.tempFilePath}
          </View>
        </View>,
      )
    })
    return nodeList
  }, [value, handleClick])

  return (
    <View className={uploadClassName}>
      {headerSlot && <View>{headerSlot}</View>}
      {headerHint && <View className='ygp-upload-hint'>{headerHint}</View>}
      <View className={`ygp-upload-${listType}`}>
        {listType === 'text' ? renderTextList() : renderPictureList()}
      </View>
      {footerHint && <View className='ygp-upload-hint'>{footerHint}</View>}
      {footerSlot && <View>{footerSlot}</View>}
      {!readonly && (
        <>
          <Popup
            visible={visible}
            onClose={hidePopup}
            titleAlign='center'
            height='200px'
            title='选择上传类型'
          >
            <View className='ygp-upload-action'>
              <View
                className='ygp-upload-action-item'
                onClick={() => {
                  hidePopup()
                  chooseMedia()
                }}
              >
                <View className='ygp-upload-action-item-img'>
                  <Image src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/local-file%402x.png' />
                </View>
                <View>上传图片</View>
              </View>
              <View
                className='ygp-upload-action-item'
                onClick={() => {
                  hidePopup()
                  chooseMessageFile()
                }}
              >
                <View className='ygp-upload-action-item-img'>
                  <Image src='https://qiniu-fe.yigongpin.com/ygp-taro-react-design/wechat-message-file%402x.png' />
                </View>
                <View>上传会话文件</View>
              </View>
            </View>
          </Popup>
        </>
      )}
    </View>
  )
}

export default Upload
