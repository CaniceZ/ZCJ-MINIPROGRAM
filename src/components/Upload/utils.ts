export const extname = (url = '') => {
  const temp = url.split('/')
  const filename = temp[temp.length - 1]
  const filenameWithoutSuffix = filename.split(/#|\?/)[0]
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0]
}

const isImageFileType = (type) => !!type && type.indexOf('image/') === 0

export const isImageUrl = (file) => {
  if (isImageFileType(file.type)) {
    return true
  }
  const url = file.tempFilePath || file.filePath
  const extension = extname(url)
  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg|ico)$/i.test(extension)
  ) {
    return true
  }
  if (/^data:/.test(url)) {
    // other file types of base64
    return false
  }
  if (extension) {
    // other file types which have extension
    return false
  }
  return true
}
