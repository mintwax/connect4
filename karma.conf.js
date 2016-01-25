module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            { pattern: 'test-context.js', watched: false }
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'test-context.js': ['webpack', 'sourcemap']
        },
        webpack: {
            module: {
                loaders: [
                    { test: /\.js/,
                      exclude: /node_modules/,
                      loader: 'babel-loader' }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        },

   //     port:      9876,
    });
};

