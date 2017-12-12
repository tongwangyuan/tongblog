var path = require("path");
var htmlWebpackPlugin = require("html-webpack-plugin");
var extractTextPlugin = require("extract-text-webpack-plugin");
var config = {
  devtool: "source-map",
  context:path.resolve(__dirname, "webpack"),
  entry: {
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
            presets: ["env"]
            //plugins: [require('babel-plugin-transform-object-rest-spread')]
          }
        }
      },
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
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
    path: path.resolve(__dirname, "webpack/dist/js"),
    filename: "[name].js",
    sourceMapFilename: "[name].map"
  },
  plugins: [
    new htmlWebpackPlugin({
      title: "my firt webpack app",
      filename: "../index.html", //指定目录,默认是output的目录(its bad begin with ouput dir)，可以['../',path.resolve(__dirname, 'webpack/dist/')+"/inde.html"],
      template: "./src/html/index.html", //指定原始目录，推荐使用path.resolve;
      hash: true,
      minify: {
        collapseInlineTagWhitespace: true //消除行内元素间隙
      }
    }),
    new extractTextPlugin("../css/apps.css")
  ]
};
module.exports = config;