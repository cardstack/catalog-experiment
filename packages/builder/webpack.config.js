const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

let config = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers":
        "Origin, X-Requested-With, Content-Type, Accept, Range",
    },
    contentBase: path.resolve(__dirname, "dist"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/assets"),
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".ts", ".js", ".json"],
  },
  node: {
    // for @babel/core
    fs: "empty",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: ["last 1 Chrome versions"] } },
              ],
            ],
            plugins: [
              "@babel/plugin-transform-typescript",
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-proposal-nullish-coalescing-operator",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
    ],
  },
};

let dom = Object.assign({}, config, {
  entry: {
    main: "./src/main.ts",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Output Management",
    }),
  ],
});

let worker = Object.assign({}, config, {
  target: "webworker",
  entry: {
    "service-worker": "./src/service-worker.ts",
  },
});

module.exports = [dom, worker];
