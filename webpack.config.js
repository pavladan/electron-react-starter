/* global require module __dirname */

const webpack = require("webpack");
const dotenv = require("dotenv");
const path = require("path");

const babelTransformClassPlugin = require("@babel/plugin-proposal-class-properties")
  .default;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = require('./webpack/paths')
const pjson = require('./package.json')

const clean = new CleanWebpackPlugin([paths.outputDir]);
const html = new HtmlWebpackPlugin({
	template: "./public/index.html"
});
const copy = new CopyWebpackPlugin([
	{
		from: "electron/electron-builder.json",
    transform: function(content, path) {
			return content
			.toString()
			.replace(/#name#/g, pjson.name)
			.replace(/#appId#/g, 'com.id.app')
			.replace(/#outputDir#/g, paths.releaseDir);
    },
    to: path.join(__dirname)
  }
]);

const dotenvConfig = dotenv.config();

module.exports = env => {
  if (!process.env.NODE_ENV) process.env.NODE_ENV = "development";
  const environmentPlugin = new webpack.EnvironmentPlugin({
    ...dotenvConfig.parsed,
    NODE_ENV: process.env.NODE_ENV
  });
  const mode = process.env.NODE_ENV;
  const config = {
    mode: mode,
    entry: paths.srcDist + "/index.js",
    resolve: {
      extensions: [".js", ".jsx"]
    },
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "fonts/[name].[ext]",
              publicPath: "../"
            }
          }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "icons/[name].[ext]",
              publicPath: "../"
            }
          }
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.(scss|sass)$/,
          loader: "style-loader!css-loader!sass-loader"
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              [babelTransformClassPlugin, { loose: true }],
              "@babel/plugin-syntax-dynamic-import"
            ]
          }
        },
        {
          test: /.html$/,
          loader: "html-loader"
        }
      ]
    },

    plugins: [clean, html, environmentPlugin, copy],
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, paths.outputDir),
      publicPath: ""
    }
  };
  if (mode === "production") {
    config.plugins.push(
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6
        }
      })
    );
  }
  return config;
};
