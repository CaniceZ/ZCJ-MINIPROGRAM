export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/task/index',
    'pages/about/index',
    'pages/login/index',
    'pages/getPhoneNumber/index',
  ],
  subpackages: [
    {
      root: 'subpackages/setting',
      pages: [
        // 用户协议
        'protocol/index',
        // 隐私政策
        'privacy/index',
        // 关于我们
        'aboutme/index',
        // 基本资料
        'userinfo/index',
      ],
    },
    {
      root: 'subpackages/task',
      pages: [
        // 考勤列表
        'checklist/index',
        // 考勤提交
        'checksubmit/index',
        // 任务详情
        'detail/index',
      ],
    },
    {
      root: 'subpackages/realname',
      pages: [
        // 实名认证-提交
        'info/index',
        // 实名认证-结果页
        'result/index',
      ],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    custom: true,
    color: '#868686',
    selectedColor: '#FF6720',
    borderStyle: 'white',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: './assets/icon/home-index.png',
        selectedIconPath: './assets/icon/home-index-active.png',
      },
      {
        text: '任务',
        pagePath: 'pages/task/index',
        iconPath: './assets/icon/home-index.png',
        selectedIconPath: './assets/icon/home-index-active.png',
      },
      {
        text: '我的',
        pagePath: 'pages/about/index',
        iconPath: './assets/icon/home-my.png',
        selectedIconPath: './assets/icon/home-my-active.png',
      },
    ],
  },
  permission: {
    'scope.userLocation': {
      desc: '您的位置信息将用于小程序位置接口的效果展示',
    },
  },
  requiredPrivateInfos: ['getLocation', 'chooseLocation'],
})
