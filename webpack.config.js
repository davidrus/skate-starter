const {resolve} = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// webpack config helpers
const { getIfUtils, removeEmpty } = require('webpack-config-utils');

module.exports = (env) => {
  const { ifProd, ifNotProd, ifTest, ifNotTest } = getIfUtils(env);
  return {
    context: resolve(__dirname, 'src'),
    entry: {
      polyfills: './polyfills.ts',
      main: './main.ts',
    },
    output: {
      filename: '[name].[hash].js',
      path: resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },
    devtool: ifProd('source-map', 'cheap-module-source-map'),
    module: {
      rules: [
        // Typescript
        {
          test: /\.tsx?$/,
          include: /src/,
          use: ['awesome-typescript-loader']
        },
        // CSS
        {
          // Do not transform vendor's CSS with CSS-modules
          // The point is that they remain in global scope.
          test: /\.css$/,
          include: /node_modules/,
          // @TODO replace with "use", we need to use legacy "loader" instead of "use" to make ExtractTextPlugin@2-beta.4 work
          use:
          [
            'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            }
          ]
        },
        {
          test: /\.css$/,
          include: /src/,
          use: ['style-loader', 'css-loader']
        },
      ]
    },
    plugins: removeEmpty([

      // Set NODE_ENV to enable production react version
      new webpack.DefinePlugin({
        'process.env': { NODE_ENV: ifProd('"production"', '"development"') }
      }),

      // prints more readable module names in the browser console on HMR updates
      ifNotProd(new webpack.NamedModulesPlugin()),

      new HtmlWebpackPlugin({
        template: resolve('src', 'index.html'),
        // https://github.com/kangax/html-minifier#options-quick-reference
        // will minify html
        minify: ifProd(
          {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            keepClosingSlash: true,
            minifyURLs: true
          },
          false
        )
      }),

    ])
  }
}