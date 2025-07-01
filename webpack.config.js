const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: [
      path.resolve(__dirname, 'src/js/main.js'),
      path.resolve(__dirname, 'src/scss/main.scss')
    ],
    editor:  path.resolve(__dirname, 'src/js/editor.js'),
    admin:  path.resolve(__dirname, 'src/scss/admin.scss')
  },
  output: {
    filename: 'js/[name].min.js', // Ensures JS goes into dist/js/
    path: path.resolve(__dirname, 'dist'),
    clean: false
  },
  resolve: {
    extensions: ['.js', '.scss'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].min.css'
    })
  ],
  devtool: 'source-map'
};
