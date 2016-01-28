 var path = require('path');
    module.exports = {
        entry: './src/main.js',
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                {
                  test: /\.js/,
                  exclude: /(node_modules|bower_components)/,
                  loader: 'babel-loader',
                  query: {
                    presets: ['es2015']
                  }
              }
            ]
        }
    };