const { resolve, join } = require("path");
const { readFileSync, existsSync } = require("fs");

let config = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-headers":
        "Origin, X-Requested-With, Content-Type, Accept, Range",
    },
    contentBase: resolve(__dirname, "test"),
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "assets"),
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".ts", ".js", ".json"],
  },
  node: {
    // for @babel/core
    fs: "empty",
  },
  plugins: [],
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
              "@babel/plugin-proposal-numeric-separator",
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

let dom = Object.assign({}, config, {
  entry: {
    main: "../builder-dom/main.ts",
    test: "./test/index.ts",
  },
});

let node = Object.assign({}, config, {
  target: "node",
  entry: {
    node: "../builder-node/src/index.ts",
    "node-test": "../builder-node/test/index.ts",
  },
  node: {
    __dirname: false,
  },
});

let worker = Object.assign({}, config, {
  target: "webworker",
  entry: {
    "service-worker": "./src/service-worker.ts",
  },
});

module.exports = [dom, worker, node];
