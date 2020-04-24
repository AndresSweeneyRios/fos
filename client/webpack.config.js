const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = () => ({
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.pug',
    }),

    new VueLoaderPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'],
          },
          {
            use: ['pug-loader'],
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'css-loader',
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true,
                includePaths: [path.resolve(__dirname, 'src', 'sass')],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          'vue-svg-loader',
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
          loaders: {
            sass: [
              'vue-style-loader',
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    indentedSyntax: true,
                    includePaths: [path.resolve(__dirname, 'src', 'sass')],
                  },
                },
              },
            ],
          },
        },
      },
    ],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'config': path.resolve(__dirname, '..', 'config', 'index.ts'),
      'css': path.resolve(__dirname, 'src', 'css'),
      'sass': path.resolve(__dirname, 'src', 'sass'),
      'assets': path.resolve(__dirname, 'src', 'assets'),
    },
    extensions: ['.tsx', '.ts', '.js', '.vue'],
  },

  entry: {
    app: './src/index.ts',
  },

  output: {
    path: path.resolve(__dirname, '..', 'dist', 'client'),
    filename: "[name].bundle.js",
  },

  devServer: {
    port: 3000,
  },
})
