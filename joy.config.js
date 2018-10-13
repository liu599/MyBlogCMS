const withCss = require('@symph/joy-css')
const withLess = require('@symph/joy-less')
const withImageLoader = require('@symph/joy-image')
const path = require('path')

module.exports = {
  serverRender: true,
  plugins: [
    withImageLoader({limit: 8192}),
    // 处理应用内组件的less样式
    withLess({
      cssModules: true
    }),
    // 处理antd中的样式
    withCss({
      cssModules: false,
      ruleOptions: {
        include: [
          path.resolve(__dirname, './node_modules/antd/')
        ]
      }
    }),

  ]
};


