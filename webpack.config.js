const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = environment => {

    //Entry
    const entry = { index: "./src/index.js" };

    //Output
    const output = {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    };

    //Loaders
    const module = {
        rules: [
            { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, use: ['eslint-loader'] },
            { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }
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
            favicon: path.resolve(__dirname, 'src/favicon.png'),
            chunks: ['index'],
            hash: true,
            minify: minifyHtmlSettings
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css?[hash]'
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
            minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin({ sourceMap: true })]
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