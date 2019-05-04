const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJsPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

function loadOutput(environment) {
    const filename = environment.production ? 'scripts/[name].[hash].min.js' : 'scripts/[name].js';
    return { path: path.resolve(__dirname, 'dist'), filename, publicPath: '/' };
};

function loadModule(environment) {

    const cssLoader = {
        loader: 'css-loader',
        options: { sourceMap: environment.production }
    };

    const sassLoader = {
        loader: 'sass-loader',
        options: { sourceMap: environment.production }
    };

    const resolveUrlLoader = {
        loader: 'resolve-url-loader',
        options: { sourceMap: environment.production }
    };

    const fileLoader = {
        loader: 'file-loader',
        options: { name: 'media/[name].[hash].[ext]' }
    };

    const imageLoader = {
        loader: 'image-webpack-loader',
        options: {
            mozjpeg: {
                progressive: true,
                quality: 65
            },
            optipng: {
                enabled: false,
            },
            pngquant: {
                quality: '65-90',
                speed: 4
            },
            gifsicle: {
                interlaced: false,
            },
            webp: {
                quality: 75
            }
        }
    }

    const rules = [
        { enforce: 'pre', test: /\.js$/, exclude: /node_modules/, use: ['eslint-loader'] },
        { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, cssLoader, resolveUrlLoader, sassLoader] },
        { test: /\.(png|jpe?g|gif)$/, use: [fileLoader, imageLoader] }
    ]

    if (environment.production) {
        rules.push({
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: ['babel-loader']
        });
    }

    return { rules };
};

function loadPlugins(environment) {
    const minifyHtmlSettings = environment.production ? {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
    } : false;

    return [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: path.resolve(__dirname, './src/favicon.png'),
            chunks: ['app'],
            hash: true,
            minify: minifyHtmlSettings
        }),
        new MiniCssExtractPlugin({
            filename: environment.production ? 'styles/[name].[hash].min.css' : 'styles/[name].css',
            chunkFilename: environment.production ? 'styles/[id].min.css' : 'styles/[id].css'
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, "./src/rust"),
            forceMode: environment.production ? 'production' : 'development',
            extraArgs: '--no-typescript --out-dir build --out-name rustlib'
        }),
        new CleanWebpackPlugin()
    ];
};

module.exports = environment => {

    const mode = environment.production ? 'production' : 'development';
    const entry = { app: './src/scripts/app.js' };
    const output = loadOutput(environment);
    const module = loadModule(environment);
    const plugins = loadPlugins(environment);

    //Base Config
    const config = { mode, entry, output, module, plugins };

    //Additional Production Config
    if (environment.production) {
        config.devtool = 'source-map';
        config.performance = { hints: 'error' };
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

    //Additional Development Config
    else {
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