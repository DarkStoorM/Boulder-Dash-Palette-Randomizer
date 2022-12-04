//webpack.config.js
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css",
  }),
];

module.exports = {
  mode: "development",
  cache: false,
  devtool: "inline-source-map",
  entry: {
    app: "./src/app.ts",
    style: "./scss/app.scss",
  },
  output: {
    path: path.resolve(__dirname, "app"),
    chunkFilename: "[name].[chunkhash].chunk.js",
    filename: "[name].js", // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
    alias: {
      // Provides ability to include node_modules with ~
      "~": path.resolve(process.cwd(), "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.scss$/,
        use: [
          // Extract and save the final CSS.
          MiniCssExtractPlugin.loader,
          // Load the CSS, set url = false to prevent following urls to fonts and images.
          { loader: "css-loader", options: { url: false, importLoaders: 1 } },
          // Add browser prefixes and minify CSS.
          { loader: "postcss-loader", options: { postcssOptions: { plugins: [autoprefixer(), cssnano()] } } },
          // Load the SCSS/SASS
          { loader: "sass-loader" },
        ],
      },
    ],
  },
  plugins: plugins,
};
