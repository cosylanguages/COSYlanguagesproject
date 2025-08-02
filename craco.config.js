const CopyPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // For a Single-Page Application, we let craco handle the default entry points.
      // We only need to add a plugin to copy the 404.html for GitHub Pages routing.
      webpackConfig.plugins.push(
        new CopyPlugin({
          patterns: [
            { from: 'public/404.html', to: '404.html' },
          ],
        })
      );

      if (env === 'production') {
        webpackConfig.plugins.push(
          new WorkboxWebpackPlugin.InjectManifest({
            swSrc: './src/service-worker.js',
            swDest: 'service-worker.js',
          })
        );
      }

      return webpackConfig;
    },
  },
  devServer: {
    historyApiFallback: true,
  },
  jest: {
    configure: {
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
    }
  }
};
