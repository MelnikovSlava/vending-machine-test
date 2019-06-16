const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CaseSensitivePathsWebpackPlugin = require('case-sensitive-paths-webpack-plugin');
const DotenvPlugin = require('webpack-dotenv-extended-plugin');
const { getIfUtils, removeEmpty, propIf } = require('webpack-config-utils');
const { CheckerPlugin } = require('awesome-typescript-loader')

const PORT = 3000;
const HOST = 'localhost'

const sourcePath = path.join(__dirname);
const appPath = path.join(__dirname, './src');
const buildPath = path.join(__dirname, './build');

module.exports = (env) => {
  const { ifDevelopment, ifProduction } = getIfUtils(env);

  return removeEmpty({
    entry: removeEmpty({
      app: removeEmpty([
        ifDevelopment(`webpack-dev-server/client?http://${HOST}:${PORT}`),
        ifDevelopment('webpack/hot/only-dev-server'),
        './src/index',
      ]),
    }),

    output: removeEmpty({
      filename: 'static/js/bundle-[hash:8].js',
      publicPath: './',
      path: buildPath,
    }),

    devtool: propIf(env == 'development', 'eval', 'source-map'),

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
        errors: true
      }
    }),

    mode: env,

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      // extensions: ['.js', '.jsx'],
      modules: [
        path.resolve(sourcePath, 'node_modules'),
        appPath
      ],
    },

    node: {
      fs: 'empty'
    },

    module: {
      rules: removeEmpty([
        {
          test: /\.(js|jsx)$/,
          // Use the include field to only apply the loader
          // modules that actually need to be transformed by it
          include: appPath,
          use: {
            loader: 'babel-loader',
            options: removeEmpty({
              // don't use .babelrc config
              babelrc: false,
              presets: [
                ["env", {
                  "targets": {
                    "browsers": ["last 2 versions", "safari >= 7"]
                  }
                }],
                "react",
                "stage-0"
              ],
              plugins: ifDevelopment(["react-hot-loader/babel"]),
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: ifDevelopment(true),
              // Do not include superfluous whitespace characters and line terminators
              compact: ifProduction(true),
            }),
          }
        },
        {
          test: /\.(ts|tsx)$/,
          include: path.join(__dirname),
          use: {
            loader: 'awesome-typescript-loader',
            options: {
              useBabel: true,
              babelOptions: removeEmpty({
                /* Important line */
                // don't use .babelrc config
                babelrc: false,
                presets: [
                  ["env", { "targets": "last 2 versions, ie 11", "modules": false }],
                  "react", "stage-0"
                ],
                plugins: ifDevelopment(["react-hot-loader/babel"]),
              }),


              // babelrc: false,
              // presets: [
              //   ["env", {
              //     "targets": {
              //       "browsers": ["last 2 versions", "safari >= 7"]
              //     }
              //   }],
              //   "react",
              //   "stage-0"
              // ],
              // plugins: ifDevelopment(["react-hot-loader/babel"]),
              // // This is a feature of `babel-loader` for webpack (not Babel itself).
              // // It enables caching results in ./node_modules/.cache/babel-loader/
              // // directory for faster rebuilds.
              // cacheDirectory: ifDevelopment(true),
              // // Do not include superfluous whitespace characters and line terminators
              // compact: ifProduction(true),
            },
          }
        },
        ifProduction({
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')({
                  'browsers': ['> 1%', 'last 2 versions']
                })],
              }
            },
            'less-loader'
          ]
        }),
        ifDevelopment({
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader?sourceMap',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')({
                  'browsers': ['> 1%', 'last 2 versions']
                })],
              }
            },
            'less-loader?sourceMap'
          ]
        }),
        {
          test: /\.(jpg|jpeg|gif|png)$/,
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static/media/img/',
            limit: 10000
          }
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: 'static/media/fonts/[name].[ext]'
          }
        },
        // {
        //   test: /\.svg$/,
        //   loader: 'svg-inline-loader'
        // },
        {
          test: /\.md$/,
          loader: 'file-loader',
          options: {
            name: 'static/media/md/[name].[ext]'
          }
        }
      ])
    },

    plugins: removeEmpty([
      ifDevelopment(new CaseSensitivePathsWebpackPlugin()),
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifProduction(new CleanWebpackPlugin(buildPath)),
      ifProduction(new UglifyJsPlugin({
        // parallelization can speedup build significantly
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          mangle: { safari10: true },
          output: { comments: false },
          compress: { drop_console: true }
        }
      })),
      ifProduction(new MiniCssExtractPlugin({
        filename: 'static/css/bundle-[hash:8].css'
      })),
      ifDevelopment(new MiniCssExtractPlugin({
        filename: 'bundle-[hash:8].css'
      })),
      new HtmlWebpackPlugin(removeEmpty({
        path: propIf(env == 'development', appPath, buildPath),
        hash: ifDevelopment(true),
        template: path.join(appPath, 'index.html'),
        filename: 'index.html',
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
      new CheckerPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new DotenvPlugin({
        defaults: './config/.env.default',
        path: './config/.env.local'
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
    ])
  })
}
