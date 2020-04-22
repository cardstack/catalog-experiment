const { resolve, join } = require("path");
const { readFileSync } = require("fs");
const { DefinePlugin } = require("webpack");

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
  plugins: [
    new DefinePlugin({
      FILE_DAEMON_KEY: JSON.stringify(
        readFileSync(join(__dirname, ".file-daemon-key")).toString()
      ),
    }),
  ],
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};

let dom = Object.assign({}, config, {
  entry: {
    main: "./src/main.ts",
    test: "./test/index.ts",
    "main-test": "./test/main.ts",
  },
});

let worker = Object.assign({}, config, {
  target: "webworker",
  entry: {
    "service-worker": "./src/service-worker.ts",
  },
});

module.exports = [dom, worker];
