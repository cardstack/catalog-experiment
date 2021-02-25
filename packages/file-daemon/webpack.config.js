const path = require("path");

module.exports = {
  mode: "development",
  target: "node",
  devtool: "inline-source-map",
  entry: {
    main: "./webpack-entrypoint.ts",
  },
  devServer: {},
  node: {
    __dirname: false,
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
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
