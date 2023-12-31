module.exports = {
  publicPath:'./',
    css: {
      loaderOptions: {
        postcss: {
          plugins: [
            require('postcss-pxtorem')({ // 把px单位换算成rem单位
              rootValue: 37.5, // vant官方使用的是37.5
              selectorBlackList: ['vant', 'mu'], // 忽略转换正则匹配项
              propList: ['*']
            })
          ]
        }
      }
    },
    configureWebpack: config => {
      if (process.env.NODE_ENV === 'production') {
        // 为生产环境修改配置...
      } else {
        // 为开发环境修改配置...
      }
    }
  }