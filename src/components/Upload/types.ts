export interface AcceptType {
  image
  video
  messageFile
}
export enum FileStatus {
  Wait = 'wait',
  Uploading = 'uploading',
  Done = 'done',
  Error = 'error',
}

export enum FileError {
  OverSizeLimit = '文件过大',
  UploadFail = '上传出错',
}

export type FieldMaps = {
  id: string
  name: string
  size: string
  path: string
  type: string
}
