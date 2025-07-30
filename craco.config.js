const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const languages = require('./language_config');
const fs = require('fs');

function getLanguageEntries() {
  return languages.reduce((acc, lang) => {
    const entryPath = `./src/pages/StudyModePage/languages/${lang}.js`;
    if (fs.existsSync(path.join(__dirname, 'src', 'pages', 'StudyModePage', 'languages', `${lang}.js`))) {
      acc[`study-${lang}`] = entryPath;
    }
    return acc;
  }, {});
}

const packageJson = require('./package.json');

function createHtmlWebpackPlugin(env, paths, options) {
  const publicPath = env === 'production' ? packageJson.homepage : '/';
  return new HtmlWebpackPlugin({
    inject: true,
    template: options.template || paths.appHtml,
    filename: options.filename,
    chunks: options.chunks,
    excludeChunks: options.excludeChunks,
    publicPath: publicPath,
  });
}

function configureWebpack(webpackConfig, { env, paths }) {
  const languageEntries = getLanguageEntries();

  webpackConfig.entry = {
    main: paths.appIndexJs,
    sw: './src/sw.js',
    study: './src/StudyRoutes.js',
    freestyle: './src/islands/freestyleIslandsEntry.js',
    ...languageEntries,
  };

  webpackConfig.plugins = webpackConfig.plugins.filter(
    (plugin) => plugin.constructor.name !== 'HtmlWebpackPlugin'
  );

  webpackConfig.plugins.push(
    createHtmlWebpackPlugin(env, paths, {
      filename: 'index.html',
      chunks: ['main'],
      excludeChunks: ['sw', 'study', 'freestyle', ...Object.keys(languageEntries)],
    })
  );

  webpackConfig.plugins.push(
    new CopyPlugin({
      patterns: [
        { from: 'public/404.html', to: '404.html' },
      ],
    })
  );

  webpackConfig.plugins.push(
    createHtmlWebpackPlugin(env, paths, {
      template: './public/freestyle.html',
      filename: 'freestyle.html',
      chunks: ['freestyle'],
      excludeChunks: ['sw', 'main', 'study', ...Object.keys(languageEntries)],
    })
  );

  webpackConfig.plugins.push(
    createHtmlWebpackPlugin(env, paths, {
      template: './public/study.html',
      filename: 'study.html',
      chunks: ['study'],
      excludeChunks: ['sw', 'main', 'studyIslands', ...Object.keys(languageEntries)],
    })
  );

  webpackConfig.plugins.push(
    createHtmlWebpackPlugin(env, paths, {
      template: './public/study-islands.html',
      filename: 'study-islands.html',
      chunks: ['studyIslands'],
      excludeChunks: ['sw', 'main', 'study', ...Object.keys(languageEntries)],
    })
  );

  languages.forEach(lang => {
    webpackConfig.plugins.push(
      createHtmlWebpackPlugin(env, paths, {
        template: './public/study.html',
        filename: `study-${lang}.html`,
        chunks: [`study-${lang}`],
        excludeChunks: ['sw', 'main', 'study', ...Object.keys(languageEntries).filter(key => key !== `study-${lang}`)],
      })
    );
  });

  return webpackConfig;
}

module.exports = {
  webpack: {
    configure: configureWebpack,
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
