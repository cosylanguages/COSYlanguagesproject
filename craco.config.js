const CopyPlugin = require('copy-webpack-plugin');

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
