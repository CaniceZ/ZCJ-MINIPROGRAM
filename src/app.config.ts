export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/about/index'
  ],
  subpackages: [
    {
      root: 'subpackages/setting',
      pages: [
        // 我的-协议
        'protocol/index',
      ],
    },
    {
      root: 'subpackages/task',
      pages: [
        // 任务详情
        'detail/index',
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
        text: '我的',
        pagePath: 'pages/about/index',
        iconPath: './assets/icon/home-my.png',
        selectedIconPath: './assets/icon/home-my-active.png',
      },
    ],
  },
})
