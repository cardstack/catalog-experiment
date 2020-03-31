const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.js",
    "service-worker": "./src/service-worker.js"
  },
  devtool: "inline-source-map",
  devServer: {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers":
        "Origin, X-Requested-With, Content-Type, Accept, Range"
    },
    contentBase: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management"
    })
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/assets")
  }
};
