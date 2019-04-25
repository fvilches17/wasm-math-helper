const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = environment => {

    //Entry
    const entry = { app: './src/app.js' };

    //Output
    const filename = environment.production ? '[name].min.js' : '[name].js';
    const output = {
        path: path.resolve(__dirname, 'dist'),
        filename
    };

    //Loaders
    const cssLoader = environment.production ? {
        loader: 'css-loader',
        options: { sourceMap: true }
    } : 'css-loader';

    const module = {
        rules: [
            { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, use: ['eslint-loader'] },
            { test: /\.css$/, use: [MiniCssExtractPlugin.loader, cssLoader] }
        ]
    };

    //Plugins
    const minifyHtmlSettings = environment.production ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
    } : false;

    const plugins = [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: path.resolve(__dirname, './src/favicon.png'),
            chunks: ['app'],
            hash: true,
            minify: minifyHtmlSettings
        }),
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
            chunkFilename: '[id].min.css'
        })
    ];

    //Base Config
    const config = { entry, output, module, plugins };

    //Production Config
    if (environment.production) {
        config.mode = 'production';
        config.devtool = 'source-map';
        config.performance = { hints: 'error', maxAssetSize: 100000 /*bytes*/ };
        config.optimization = {
            minimizer: [
                new OptimizeCssAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false,
                            annotation: true,
                        }
                    }
                }),
                new TerserJsPlugin({ sourceMap: true })
            ]
        };
    }

    //Development Config
    else {
        config.mode = 'development';
        config.devServer = {
            compress: true,
            contentBase: path.join(__dirname, 'dist'),
            open: true,
            overlay: { errors: true, warnings: false },
            port: 5000,
            watchContentBase: true
        };
    }

    return config;
};