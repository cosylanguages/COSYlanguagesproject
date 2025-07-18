const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const languages = ['ba', 'br', 'de', 'el', 'en', 'es', 'fr', 'hy', 'it', 'pt', 'ru', 'tt'];
      const languageEntries = languages.reduce((acc, lang) => {
        acc[`study-${lang}`] = `./src/pages/StudyModePage/languages/${lang}.js`;
        return acc;
      }, {});

      webpackConfig.entry = {
        main: paths.appIndexJs,
        sw: './src/sw.js', // Added service worker entry point
        study: './src/StudyRoutes.js', // Added study mode entry point
        ...languageEntries,
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
          excludeChunks: ['sw', 'study', ...Object.keys(languageEntries)], // Exclude the service worker and study mode
          publicPath: env === 'production' ? '' : '/',
        })
      );

      // Add our own HtmlWebpackPlugin for study.html
      webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
          inject: true,
          template: './public/study.html', // public/study.html
          filename: 'study.html',
          chunks: ['study'], // Only include the study bundle related chunks
          excludeChunks: ['sw', 'main', ...Object.keys(languageEntries)], // Exclude the service worker and main
          publicPath: env === 'production' ? '' : '/',
        })
      );

      // Add our own HtmlWebpackPlugin for each language
      languages.forEach(lang => {
        webpackConfig.plugins.push(
          new HtmlWebpackPlugin({
            inject: true,
            template: './public/study.html', // public/study.html
            filename: `study-${lang}.html`,
            chunks: [`study-${lang}`], // Only include the language bundle related chunks
            excludeChunks: ['sw', 'main', 'study', ...Object.keys(languageEntries).filter(key => key !== `study-${lang}`)], // Exclude the service worker, main, and other languages
            publicPath: env === 'production' ? '' : '/',
          })
        );
      });

      return webpackConfig;
    },
  },
};
