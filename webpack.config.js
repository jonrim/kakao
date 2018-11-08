'use strict';

const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: [
    './client/src/index.js',
    'webpack-hot-middleware/client'
  ],
  output: {
    path: path.join(__dirname, 'client', 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
  },
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['client', 'node_modules'],
    alias: {
      'Components': path.resolve(__dirname, 'client/src/components'),
      'Utils': path.resolve(__dirname, 'client/src/utils'),
      'Styles': path.resolve(__dirname, 'client/src/styles'),
      'Modules': path.resolve(__dirname, 'client/src/modules'),
      'Api': path.resolve(__dirname, 'client/src/api'),
      'Actions': path.resolve(__dirname, 'client/src/actions'),
      'Constants': path.resolve(__dirname, 'client/src/constants'),
      'Sagas': path.resolve(__dirname, 'client/src/sagas'),
    }
  },
  /* historyApiFallback needs to be true to have routes working properly on localhost */
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          devMode ? 'style-loader' : MiniCSSExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              plugins: (loader) => [
                autoprefixer()
              ]
            }
          }, 
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                autoprefixer(),
                precss()
              ]
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'
          },
          {
            loader: 'image-webpack-loader?${JSON.stringify(query)}'
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './client/src/index.html',
      filename: './index.html'
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new webpack.HotModuleReplacementPlugin(),
    // new CopyWebpackPlugin([{
    //   from: './client/src/images',
    //   to: 'images'
    // }]),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
};