const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
module.exports = {
    // 入口文件的配置
    entry: {
        app: './src/index.js',
        test: './src/test.js'
    },
    // 出口文件的配置
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    // 模块loader
    module: {
        rules: [
            {
                test: /\.css$/, // 正则匹配以css结尾的文件
                // use: ['style-loader', 'css-loader']
                // 或 以对象形式
                // use: [
                //     { 
                //         loader: 'style-loader'
                //     },{
                //         loader: 'css-loader'
                //     }
                // ]
                use: ExtractTextPlugin.extract({  // 将css单独打包的插件
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: { importLoader: 1}
                    }, 'postcss-loader']
                })
            },
            {
                test: /\.(html|htm)$/i,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500, // 大小限制， 小于该大小的图片会被打包成base64
                        outputPath: 'images/' // 文件输出的路径
                    }
                }]
            },
            {
                test: /\.scss$/,
                // use: [{
                //     loader: 'style-loader'
                // },{
                //     loader: 'css-loader'
                // },{
                //     loader: 'sass-loader'
                // }],
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    },{
                        loader: 'sass-loader'
                    }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "env"
                        ]
                    }
                }
            }
        ]
    },
    // 插件
    plugins: [
        new HtmlPlugin({
            // 压缩
            minify: {
                removeAttributeQuotes: true // 去除html属性两边的引号
            },
            hash: true, // 文件后缀哈希
            template: './src/index.html'
        }),
        new ExtractTextPlugin('css/styles.css'),
        // new UglifyJSPlugin()    // 在开发环境中会导致dev-server出错 
        // new PurifyCSSPlugin({
        //     paths: glob.sync(path.join(__dirname, 'src/*.html')),
        // }) 
        
    ],
    // devServer

    devServer: {
        // 设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        // 主机地址
        host: 'localhost',
        // 端口
        port: '8081',
        // 开启gzip压缩
        compress: true, 
        // 开启热更新
    }
}