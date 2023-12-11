// svgo.config.js
module.exports = {
    multipass: true, // boolean. false by default
    // datauri: 'enc', // 'base64' (default), 'enc' or 'unenc'.
    js2svg: {
      indent: 2, // string with spaces or number of spaces. 4 by default
      pretty: true, // boolean, false by default
    },
    plugins: [
      // 默认情况下启用的一组内置插件
      'preset-default',
  
      // 按名称启用内置插件
      'prefixIds',
  
      // 或通过允许配置插件的扩展符号
      {
        name: 'removeAttrs',
        params: {
            attrs: "(fill|stroke|fill-rule)"
        },
      },
    ],
  };