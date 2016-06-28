var webpack = require('webpack');

module.exports = {
    entry: 'src/autosize-input',
    debug: false,
    production: true,
    externals: {
        ractive: 'Ractive'
    },
    output: {
        path: __dirname + '/',
        filename: 'ractive-autosize-input.js',
        library: 'RactiveAutosizeInput',
        libraryTarget: 'umd'
    },

    resolve: {
        root: process.cwd(),
        modulesDirectories: ['node_modules', 'css', 'js', 'templates'],
        extensions: ['', '.js', '.styl', '.html'],
    },

    module: {
        loaders: [
            {test: /\.styl$/, loader:'style-loader!css-loader!stylus-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.html/, loader: 'ractive'}
        ],
    },
}
