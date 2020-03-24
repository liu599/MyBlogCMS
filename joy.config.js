const withCss = require('@symph/joy-css')
const withLess = require('@symph/joy-less')
const withImageLoader = require('@symph/joy-image')
const path = require('path')
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  serverRender: false,
  publicRuntimeConfig: {
    NEKOHAND_CMS_VERSION: `${require("./package.json").version}`,
  },
  assetPrefix: isProd ? 'https://ayasa.ecs32.top' : '',
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


