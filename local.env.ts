// 本套环境配置只对开发、体验版小程序生效
type LocalEnv = {
  env: 'dev' | 'test' | 'uat' | 'prod'
  override: { java?: string; uc?: string }
}

const env: LocalEnv = {
  env: 'dev',
  // 用来覆盖env指定的环境配置（可用于与后端开发本地服务联调）
  override: {
    /**
     * 后端开发本地启动了所有微服务项目
     */
    // java: 'http://192.168.10.51:9988/',
    /**
     * 后端开发本地只启动某个微服务项目(以下配置优先级高于java)
     */
    // uc: 'http://192.168.10.56:8087/',
  },
}

export default env
