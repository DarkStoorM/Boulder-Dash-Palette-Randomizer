//webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const plugins = [
  new TerserPlugin({
    parallel: true,
    extractComments: false,
    terserOptions: {
      format: {
        comments: false,
      },
    },
  }),
];

module.exports = {
  mode: "development",
  cache: false,
  devtool: "inline-source-map",
  entry: {
    main: "./src/app.ts",
  },
  output: {
    path: path.resolve(__dirname, "app"),
    filename: "bundle.js", // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: plugins,
};
