// 后端返回的数据结构
export type UserInfoType = {
  address: string
  businessLicensePhoto: []
  city: string
  cityCode: number
  countryCn: string
  countryCode: string
  countryEn: string
  district: string
  districtCode: number
  enterpriseType: number
  entityAlias: string
  entityCode: string
  entityIdentityRelations: {
    entityCode: string
    id: string
    identityCode: string
    identityType: number
  }[]
  entityName: string
  entityStatus: number
  entityUserRelationDTOS: []
  id: string
  legalPerson: string
  mobilePhone: string
  province: string
  provinceCode: number
  taxNumber: string
  userIdentityRelations: []
}

// 用户身份
export enum UserTypeEnum {
  Suppiler = 'Supplier',
  Custmer = 'Custmer',
}

export type UserType = {
  token: string
  info: Partial<UserInfoType>
  enterpriseList: any[]
  userType?: `${UserTypeEnum}`
}
