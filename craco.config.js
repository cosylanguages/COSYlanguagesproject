const CopyPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // For a Single-Page Application, we let craco handle the default entry points.
      // We only need to add a plugin to copy the 404.html for GitHub Pages routing.
      // We replace the specific CopyPlugin for 404.html with a more general one
      // to ensure all files from the public directory are copied to the build output.
      webpackConfig.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: 'public',
              to: '.', // to the root of the build directory
              globOptions: {
                ignore: ['**/index.html'], // index.html is handled by HtmlWebpackPlugin
              },
            },
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
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
      },
    },
  },
  jest: {
    configure: {
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
    }
  }
};
