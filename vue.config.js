module.exports = {
  chainWebpack: config => {
    // 开发环境下打包配置
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main.js')
      config.plugin('html').tap(args => {
        // 根据环境不同配置html显示的标题或者资源等
        args[0].isProd = false
        return args
      })
    })
    config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // 通过打包cdn资源引入
    // config.set('externals', {
    //   vue: 'Vue'
    // })
  }
}
