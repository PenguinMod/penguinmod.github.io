const defaultsDeep = require('lodash.defaultsdeep');
var path = require('path');
var webpack = require('webpack');

// Plugins
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var TWGenerateServiceWorkerPlugin = require('./src/playground/generate-service-worker-plugin');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// PostCss
var autoprefixer = require('autoprefixer');
var postcssVars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');

const STATIC_PATH = process.env.STATIC_PATH || '/static';

let root = process.env.ROOT || '';
if (root.length > 0 && !root.endsWith('/')) {
    throw new Error('If ROOT is defined, it must have a trailing slash.');
}

const htmlWebpackPluginCommon = {
    root: root,
    meta: JSON.parse(process.env.EXTRA_META || '{}')
};

const base = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: process.env.SOURCEMAP ? process.env.SOURCEMAP : process.env.NODE_ENV === 'production' ? false : 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'build'),
        host: '0.0.0.0',
        compress: true,
        port: process.env.PORT || 8601,
        historyApiFallback: {
            rewrites: [
                { from: /^\/\d+\/?$/, to: '/index.html' },
                { from: /^\/\d+\/fullscreen\/?$/, to: '/fullscreen.html' },
                { from: /^\/\d+\/editor\/?$/, to: '/editor.html' },
                { from: /^\/\d+\/playground\/?$/, to: '/playground.html' },
                { from: /^\/\d+\/embed\/?$/, to: '/embed.html' },
                { from: /^\/addons\/?$/, to: '/addons.html' }
            ]
        }
    },
    output: {
        library: 'GUI',
        filename: process.env.NODE_ENV === 'production' ? 'js/[name].[contenthash].js' : 'js/[name].js',
        chunkFilename: process.env.NODE_ENV === 'production' ? 'js/[name].[contenthash].js' : 'js/[name].js',
        publicPath: root
    },
    resolve: {
        symlinks: false,
        alias: {
            'text-encoding$': path.resolve(__dirname, 'src/lib/tw-text-encoder'),
            'scratch-render-fonts$': path.resolve(__dirname, 'src/lib/tw-scratch-render-fonts')
        }
    },
    node: { fs: 'empty' },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: [
                    path.resolve(__dirname, 'src'),
                    /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
                    /node_modules[\\/]pify/,
                    /node_modules[\\/]@vernier[\\/]godirect/
                ],
                use: [
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve(__dirname, '.webpack/cache1-babel')
                        }
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            plugins: [
                                ['react-intl', {
                                    messagesDir: './translations/messages/'
                                }]
                            ],
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { 
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve(__dirname, '.webpack/cache2-postcss')
                        }
                    },
                    { 
                        loader: 'css-loader', 
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                            camelCase: true
                        }
                    },
                    { 
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: () => [postcssImport, postcssVars, autoprefixer]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HardSourceWebpackPlugin({
            cacheDirectory: path.resolve(__dirname, '.webpack/cache3-hard-source')
        })
    ],
};

if (!process.env.CI) base.plugins.push(new webpack.ProgressPlugin());

module.exports = [
    defaultsDeep({}, base, {
        entry: {
            'editor': './src/playground/editor.jsx',
            'playground': './src/playground/playground.jsx',
            'player': './src/playground/player.jsx',
            'fullscreen': './src/playground/fullscreen.jsx',
            'embed': './src/playground/embed.jsx',
            'addon-settings': './src/playground/addon-settings.jsx',
            'credits': './src/playground/credits/credits.jsx'
        },
        output: { path: path.resolve(__dirname, 'build') },
        module: {
            rules: base.module.rules.concat([
                {
                    test: /\.(svg|png|wav|gif|jpg|mp3|ttf|otf|ico)$/,
                    loader: 'file-loader',
                    options: { outputPath: 'static/assets/' }
                }
            ])
        },
        optimization: {
            splitChunks: {
                chunks: 'all',
                minChunks: 2,
                minSize: 50000,
                maxInitialRequests: 5
            }
        },
        plugins: base.plugins.concat([
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                'process.env.DEBUG': Boolean(process.env.DEBUG),
                'process.env.ANNOUNCEMENT': JSON.stringify(process.env.ANNOUNCEMENT || ''),
                'process.env.ENABLE_SERVICE_WORKER': JSON.stringify(process.env.ENABLE_SERVICE_WORKER || ''),
                'process.env.ROOT': JSON.stringify(root),
                'process.env.ROUTING_STYLE': JSON.stringify(process.env.ROUTING_STYLE || 'filehash')
            }),
            new HtmlWebpackPlugin({
                chunks: ['editor'], template: 'src/playground/index.ejs', filename: 'editor.html',
                title: 'PenguinMod - Editor', ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['playground'], template: 'src/playground/index.ejs', filename: 'playground.html',
                title: 'PenguinMod - Playground', ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['player'], template: 'src/playground/index.ejs', filename: 'index.html',
                title: 'PenguinMod - A mod of TurboWarp', ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['fullscreen'], template: 'src/playground/index.ejs', filename: 'fullscreen.html',
                title: 'PenguinMod - A mod of TurboWarp', ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['embed'], template: 'src/playground/index.ejs', filename: 'embed.html',
                title: 'Embedded Project - PenguinMod', noTheme: true, ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['addon-settings'], template: 'src/playground/simple.ejs', filename: 'addons.html',
                title: 'Addon Settings - PenguinMod', ...htmlWebpackPluginCommon
            }),
            new HtmlWebpackPlugin({
                chunks: ['credits'], template: 'src/playground/simple.ejs', filename: 'credits.html',
                title: 'PenguinMod & TurboWarp Credits', noSplash: true, ...htmlWebpackPluginCommon
            }),
            new CopyWebpackPlugin({ patterns: [{ from: 'static', to: '' }] }),
            new CopyWebpackPlugin({ patterns: [{ from: 'node_modules/scratch-blocks/media', to: 'static/blocks-media' }] }),
            new CopyWebpackPlugin({ patterns: [{ from: 'extensions/**', to: 'static', context: 'src/examples' }] }),
            new TWGenerateServiceWorkerPlugin()
        ])
    })
];
