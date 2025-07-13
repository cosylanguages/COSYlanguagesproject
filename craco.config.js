const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = {
        main: paths.appIndexJs,
        freestyle: path.resolve(__dirname, 'src/islands/freestyleIslandsEntry.js'), // Updated path
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

      // Add our HtmlWebpackPlugin for freestyle.html
      webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: path.resolve(__dirname, 'public/freestyle.html'),
          filename: 'freestyle.html',
          chunks: ['freestyle'], // Only include the freestyle bundle related chunks
          publicPath: env === 'production' ? '/COSYlanguagesproject/' : '/',
        })
      );

      // Consider CRA's default behavior for things like publicPath, manifest, favicon etc.
      // HtmlWebpackPlugin has options for these. If they are missing from the generated HTML,
      // we might need to copy more options from how CRA configures the original plugin,
      // or ensure `paths.publicUrlOrPath` is respected.
      // For example, for manifest and favicon, we might need to add them explicitly if filtering out the original plugin removes them.
      // Let's check the output after this change.

      // Optional: If you want to ensure that a common runtime chunk is generated and used by both,
      // you might need to configure optimization.runtimeChunk.
      // webpackConfig.optimization.runtimeChunk = 'single';
      // And then add 'runtime' to the chunks array for both HtmlWebpackPlugin instances.
      // For now, let's keep it simple and see if separate runtimes work fine.

      return webpackConfig;
    },
  },
};
