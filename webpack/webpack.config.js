var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');

var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

console.log(process.env.NODE_ENV);
const prod = process.env.NODE_ENV === 'production';

module.exports = {
    entry: (
        !prod ? {
            app: [
                'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
                './src/bootstrap.js'
            ]} : {
            app: [
                './src/bootstrap.js'
            ].concat(Object.keys(nodeExternals()))
        }
    ),
    target: 'node',
    output: {
        path: path.join(__dirname, '../build'),
        filename: 'backend.js'
    },
    externals: nodeExternals(),
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                },
                exclude:
                    (prod ? /node_modules/ : undefined)

            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            '__PRODUCTION__': prod
        })
    ]
}