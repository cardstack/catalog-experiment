const { resolve, join } = require("path");
const { readFileSync, existsSync } = require("fs");
const { DefinePlugin } = require("webpack");

const fileDaemonKeyFile = join(__dirname, ".file-daemon-key");
let fileDaemonKey;
if (existsSync(fileDaemonKeyFile)) {
  fileDaemonKey = readFileSync(join(__dirname, ".file-daemon-key")).toString();
} else {
  console.warn(
    `The file daemon key file '${fileDaemonKeyFile}' is missing, file daemon testing will not work without this file.`
  );
}

let config = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: resolve(__dirname, "test"),
  },
  entry: {
    test: "./test/index.ts",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "assets"),
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".ts", ".js", ".json"],
  },
  plugins: [
    new DefinePlugin({
      FILE_DAEMON_KEY: JSON.stringify(
        fileDaemonKey || "FILE_DAEMON_KEY_NOT_SET"
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

module.exports = config;
