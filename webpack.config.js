const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./app/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, use: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({
        template: "app/index.html"
      }),
      new CopyWebpackPlugin([
          {
              from: '_redirects'
          }
      ])
  ],
  devServer: {
    historyApiFallback: true
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};
