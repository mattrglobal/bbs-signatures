const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = [
  {
    entry: "./index.web-sample.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bbs-signatures.min.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "template.html",
      }),
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "../../"),
      }),
      // Have this example work in Edge which doesn't ship `TextEncoder` or
      // `TextDecoder` at this time.
      new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"],
        TextDecoder: ["text-encoding", "TextDecoder"],
        TextEncoder: ["text-encoding", "TextEncoder"],
      }),
    ],
    mode: "development",
    stats: "errors-only",
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        buffer: require.resolve("buffer"),
        stream: require.resolve("stream-browserify"),
      },
    },
  },
];
