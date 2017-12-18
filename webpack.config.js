const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const cleanPlugin = require("clean-webpack-plugin");
const uglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
let config = {
  devtool: "source-map",
  context:path.resolve(__dirname, "webpack"),
  entry: {
    ployfill:"../node_modules/babel-polyfill/dist/polyfill.min.js",
    entry: "./src/js/entry.js",
    app: "./src/js/app.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": ["env"],
            "plugins": ['transform-regenerator','transform-es2015-spread']
            //plugins: [require('babel-plugin-transform-object-rest-spread')]
          }
        }
      },
      {
        test: /\.css$/,
        /* use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: ["style-loader","css-loader"]
        }) */
        use:["style-loader","css-loader"]
      },
      {
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "webpack/dist"),
    filename: "[name].js",
    sourceMapFilename: "[name].map"
  },
  devServer:{
    publicPath:"/webpack/dist",//必须与output目标位置保持一致，否则热更新遇到问题
    hot:true
  },
  plugins: [
    //new cleanPlugin([path.resolve(__dirname, "webpack/dist")]),
    new htmlWebpackPlugin({
      title: "my firt webpack app",
      filename: "./index.html", //指定目录,默认是output的目录(its bad begin with ouput dir)，可以['../',path.resolve(__dirname, 'webpack/dist/')+"/inde.html"],
      template: "./src/html/index.html", //指定原始目录，推荐使用path.resolve;
      hash: true,
      minify: {
        collapseInlineTagWhitespace: true //消除行内元素间隙
      }
    }),
    //new extractTextPlugin(path.resolve(__dirname,"webpack/dist/css/apps.css")),
    new extractTextPlugin("./apps.css"),
    new webpack.NamedModulesPlugin(),//用于控制台输出模块名称
    new webpack.HotModuleReplacementPlugin(),//模块热替换
    new uglifyJsPlugin(),//用于 tree shaking；
  ]
};
module.exports = config;
