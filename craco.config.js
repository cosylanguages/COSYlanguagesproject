const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = {
        main: paths.appIndexJs,
      };

      // Filter out CRA's default HtmlWebpackPlugin instance(s)
      webpackConfig.plugins = webpackConfig.plugins.filter(
        (plugin) => plugin.constructor.name !== 'HtmlWebpackPlugin'
      );

      // Add our own HtmlWebpackPlugin for index.html
      webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: paths.appHtml, // public/index.html
          filename: 'index.html',
          chunks: ['main'], // Only include the main bundle related chunks
          publicPath: env === 'production' ? '/COSYlanguagesproject/' : '/',
        })
      );

      return webpackConfig;
    },
  },
};
