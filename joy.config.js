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
    withCss({
      cssModules: true,
      ruleOptions: {
        exclude: [
          path.resolve(__dirname, './node_modules/'),
          path.resolve(__dirname, './src/editor.css')
        ]
      }
    }),
    withCss({
      cssModules: false,
      ruleOptions: {
        include: [
          path.resolve(__dirname, './node_modules/'),
          path.resolve(__dirname, './src/editor.css')
        ]
      }
    })
  ]
};


