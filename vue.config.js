const {defineConfig} = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : '/',
  chainWebpack: (config) => {
    config.resolve.alias
      //set第一个参数：设置的别名，第二个参数：设置的路径
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('assets', resolve('./src/assets'))
      .set('views', resolve('./src/views'));
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
  },
  css: {
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
      },
      stylus: {},
      postcss: {
        // 这里的选项会传递给 postcss-loader

      },
      less: {},
    }
  }
})
