const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    main: "./src/index.ts",
    "service-worker": "./src/service-worker.ts"
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
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".ts", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [],
            plugins: ["@babel/plugin-transform-typescript"]
          }
        }
      }
    ]
  }
};
