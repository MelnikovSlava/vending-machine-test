const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CaseSensitivePathsWebpackPlugin = require("case-sensitive-paths-webpack-plugin");
const DotenvPlugin = require("webpack-dotenv-extended-plugin");
const { getIfUtils, removeEmpty, propIf } = require("webpack-config-utils");

const PORT = 3000;
const HOST = "localhost";

const sourcePath = path.join(__dirname);
const appPath = path.join(__dirname, "./src");
const buildPath = path.join(__dirname, "./build");

module.exports = (env) => {
  const { ifDevelopment, ifProduction } = getIfUtils(env);

  return removeEmpty({
    entry: removeEmpty({
      app: removeEmpty([
        ifDevelopment(`webpack-dev-server/client?http://${HOST}:${PORT}`),
        ifDevelopment("webpack/hot/only-dev-server"),
        "./src/index",
      ]),
    }),

    output: removeEmpty({
      filename: "static/js/bundle-[hash:8].js",
      path: buildPath,
      publicPath: "/",
    }),

    devtool: propIf(env == "development", "eval", "source-map"),

    devServer: ifDevelopment({
      inline: true,
      host: HOST,
      port: PORT,
      historyApiFallback: true,
      hot: true,
      disableHostCheck: true,
      clientLogLevel: "error",
      open: true,
      overlay: {
        warnings: true,
        errors: true,
      },
    }),

    mode: env,

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      modules: [
        path.resolve(sourcePath, "node_modules"),
        appPath,
      ],
    },

    node: {
      fs: "empty",
    },

    module: {
      rules: removeEmpty([
        {
          test: /\.(ts|tsx)$/,
          // include: path.join(__dirname),
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: removeEmpty({
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                env == "development" && "react-hot-loader/babel",
              ].filter(Boolean),
              cacheDirectory: true,
            }),
          },
        },
        ifProduction({
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: [require("autoprefixer")],
              },
            },
            "less-loader",
          ],
        }),
        ifDevelopment({
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader?sourceMap",
            {
              loader: "postcss-loader",
              options: {
                plugins: [require("autoprefixer")],
              },
            },
            "less-loader?sourceMap",
          ],
        }),
        {
          test: /\.(jpg|jpeg|gif|png)$/,
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "static/media/img/",
            limit: 10000,
          },
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: "file-loader",
          options: {
            name: "static/media/fonts/[name].[ext]",
          },
        },
        // {
        //   test: /\.svg$/,
        //   loader: 'svg-inline-loader'
        // },
      ]),
    },

    plugins: removeEmpty([
      ifDevelopment(new CaseSensitivePathsWebpackPlugin()),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifProduction(new CleanWebpackPlugin()),
      ifProduction(new UglifyJsPlugin({
        parallel: true, //parallelization can speedup build significantly
        sourceMap: true,
        uglifyOptions: {
          output: { comments: false },
          compress: { drop_console: true }, //to discard calls to console.*
        },
      })),
      ifProduction(new MiniCssExtractPlugin({
        filename: "static/css/bundle-[hash:8].css",
      })),
      ifDevelopment(new MiniCssExtractPlugin({
        filename: "bundle-[hash:8].css",
      })),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.NamedModulesPlugin(),
      new HtmlWebpackPlugin(removeEmpty({
        path: propIf(env == "development", appPath, buildPath),
        hash: ifDevelopment(true),
        template: path.join(appPath, "index.html"),
        filename: "index.html",
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      })),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new DotenvPlugin({
        defaults: "./config/.env.default",
        path: "./config/.env.local",
      }),
      // new CopyWebpackPlugin([
      //   {
      //     from: 'src/assets/img',
      //     to: 'static/media/img',
      //     toType: 'dir'
      //   },
      //   {
      //     from: 'src/assets/favicons',
      //     to: 'static/media/favicons',
      //     toType: 'dir'
      //   },
      // ],
      //   {
      //     debug: 'info'
      //   })
    ]),
  });
};
