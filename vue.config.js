const {defineConfig} = require('@vue/cli-service')
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = defineConfig({
  devServer: {   // 本地服务器配置(npm run serve)
    historyApiFallback: true,
    allowedHosts: "all",
    port: 8080, // 端口
    // host: "localhost", // 域名
    https: false, // 是否开启https
    open: false	// 是否在开启服务器后自动打开浏览器访问该服务器
  },
  lintOnSave: false,  // 取消lint语法检测，此处可不配置
  outputDir: "dist", // build打包输出目录
  assetsDir: "assets", // 静态文件输出目录，基于dist
  indexPath: "index.html",  // 输出html文件名
  transpileDependencies: true,
  productionSourceMap: false, // 取消.map文件的打包，加快打包速度
  publicPath: process.env.NODE_ENV === 'production' ? '/admin/' : './',
  chainWebpack: (config) => {
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    });
    config.resolve.alias
      //set第一个参数：设置的别名，第二个参数：设置的路径
      .set('@', resolve('./src'))
      .set('components', resolve('./src/components'))
      .set('assets', resolve('./src/assets'))
      .set('views', resolve('./src/views'));
    // 修改图片打包配置
    // config.module
      /*.rule("images")
      .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
      .use("image-webpack-loader")
      .loader("image-webpack-loader")
      .options({
        bypassOnDebug: true,
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false,
        },
        pngquant: {
          quality: '65-90',
          speed: 4
        },
        gifsicle: {
          interlaced: false,
        }
      }).end()*/
      /*.rule('url-images')
      .test(/\.(png|jpe?g|gif|webp|cur)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        // 修改它的选项...
        name: `assets/img/[name].[contenthash:8].[ext]`,// 修改文件名
        // 这是字节(Byte)限制,1KB = 1024Byte,当图片的大小小于4KB(默认值),则会被转为base64格式,打包进js文件,
        // 大于4KB,则会被打包进 img 文件夹,供链接请求获取。
        limit: 13000,
      }).end()*/
      /*.rule('other-file')
      .test(/\.(cur)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        // 修改它的选项...
        name: `assets/other/[name].[contenthash:8].[ext]`,// 修改文件名
      }).end()*/
    // 修改js文件名
    // config.output.chunkFilename(`assets/js/[name].js`)
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      return {
        plugins: [],
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】

        }
      }

    }
  },
  css: {
    extract: {
      // 自定义打包的 css 文件名和路径
      chunkFilename: `assets/css/[name].[contenthash:8].css`
    },
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
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,
})
