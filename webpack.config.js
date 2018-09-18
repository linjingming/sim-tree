const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: ['./src/simTree.js', './src/index.js']
    },
    output: {
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.js', '.css', '.scss', '.json']     
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: ['url-loader?limit=8192']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],
    optimization: {

    },
    devServer: {
        contentBase: path.join(__dirname, 'src'),
        port: 9090,
        host: 'localhost',
        inline: true,
        hot: true,
        before: require('./src/mock/config'),
    }
}