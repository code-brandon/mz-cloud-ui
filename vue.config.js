const {defineConfig} = require('@vue/cli-service')
const path = require('path')
const Config = require('./src/config/ENV.js')
const CompressionPlugin = require('compression-webpack-plugin')

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
    open: false,	// 是否在开启服务器后自动打开浏览器访问该服务器
    // proxy: 'http://localhost:8848' // 针对于只有一个后台服务器地址
    proxy: {  // 针对具有多个后台服务器地址
      '/biying': {
        target: 'https://cn.bing.com', // 发送请求到哪个服务器
        ws: true, // 是否开启websocket
        changeOrigin: true, // 是否支持跨域
        pathRewrite: { "^/biying": "" }, // 重写路径，将/api替换成空字符串
      }
    }
  },
  lintOnSave: false,  // 取消lint语法检测，此处可不配置
  outputDir: "dist", // build打包输出目录
  assetsDir: "static", // 静态文件输出目录，基于dist
  indexPath: "index.html",  // 输出html文件名
  transpileDependencies: true,
  productionSourceMap: false, // 取消.map文件的打包，加快打包速度
  publicPath: process.env.NODE_ENV === "development" ? Config.publicPath.dev : Config.publicPath.pro,
  configureWebpack: {
    name: 'Mz管理系统',
    resolve: {
      alias: {
        '@': resolve('src'),
        'components': resolve('src/components'),
        'assets': resolve('src/assets'),
        'utils': resolve('src/utils'),
        'views': resolve('src/views')
      }
    },
    plugins: [
      // 使用gzip解压缩静态文件
      new CompressionPlugin({
        cache: false,                   // 不启用文件缓存
        test: /\.(js|css|html)?$/i,     // 压缩文件格式
        filename: '[path].gz[query]',   // 压缩后的文件名
        algorithm: 'gzip',              // 使用gzip压缩
        // minRatio: 0.8,                   // 压缩率小于1才会压缩
        threshold: 10240,
      })
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch');//默认开启prefetch(预先加载模块)，提前获取用户未来可能会访问的内容 在首屏会把这十几个路由文件，都一口气下载了 所以我们要关闭这个功能模块
    /*if (process.env.NODE_ENV !== 'development') {
      // 对超过10kb的文件gzip压缩
      config.plugin('compressionPlugin').use(
        new CompressionPlugin({
          test: /\.(js|css|html)$/,// 匹配文件名
          threshold: 10240,
        })
      );
    }*/

    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    });
    // 修改js文件名
    config.output.chunkFilename(`static/js/mz-[contenthash:8].js`).end();
    config.output.filename(`static/js/mz-[contenthash:8].js`).end();


    // set svg-sprite-loader
    config.module
    // .rule('image-webpack-loader')
    // .test(/\.(png|jpe?g|gif)(\?.*)?$/)
    // .use('image-webpack-loader')
    // .loader("image-webpack-loader")
    // .options({
    //     disable: process.env.NODE_ENV == 'development' ? true : false, // 开发环境禁用压缩，生产环境才做压缩，提升开发调试速度
    //     mozjpeg: { quality: 60 }, // 压缩JPEG图像，压缩质量quality为60，范围0到100
    //     optipng: { enabled: true }, // 压缩PNG图像，enabled为true开启压缩
    //     pngquant: { quality: [0.65, 0.90], speed: 4 }, // 质量区间和速度就使用默认值吧
    //     gifsicle: { interlaced: false }, // Interlace gif for progressive rendering 默认false
    //     webp: { quality: 60 } // 压缩webp图片，压缩质量quality为60，范围0到100
    // })
    // .end() // 返回上一级 继续添加loader
    // .rule('url-loader')
    // .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    // .use('url-loader')
    // .loader('url-loader')
    // .options({
    //     limit: 1024 * 12,// 小于12kb的图片压缩成base64，图片太大转成base64反而不太合适
    //     name: "static/img/[name].[ext]",//指定打包后的图片存放的位置，一般放在static下img文件夹里 name.ext分别为：文件名.文件后缀（按照原图片名）
    //     quality:85,
    //     esModule: false,
    // })
    // .end()
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'svg-icon-[name]'
      })
      .end()
      .rule('json')
      .test(/\.json$/)
      .use('json-loader')
      .loader('json-loader')
      .options({
        symbolId: '[name]'
      })
      .end()
     

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // only package third parties that are initially dependent
              },
              elementUI: {
                name: 'chunk-elementUI', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          })
          config.optimization.runtimeChunk('single'),
            {
              from: path.resolve(__dirname, './public/robots.txt'), //防爬虫文件
              to: './' //到根目录下
            }
        }
      )
  },
  css: {
    extract: {
      // 自定义打包的 css 文件名和路径
      chunkFilename: `static/css/mz-[contenthash:8].css`,
      filename: `static/css/mz-[contenthash:8].css`,
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
      sass: {},
    }
  },
  // 构建时开启多进程处理 babel 编译
  parallel: require('os').cpus().length > 1,
})
