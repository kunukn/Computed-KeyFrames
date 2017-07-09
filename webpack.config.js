var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {

    var isProd = env.production === true;
    var nodeEnv = isProd
        ? 'production'
        : 'development';

    console.log(`------------ ${nodeEnv} ------------`);

    var plugins = [
        new ExtractTextPlugin('[name].css'), new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv)
            }
        }),
        new HtmlWebpackPlugin({template: 'src/index.html'})
    ];

    return {
        devtool: 'source-map',
        context: path.resolve('./'),
        entry: {
            demo: ['./src/index']
        },
        output: {
            path: path.resolve('dist'),
            publicPath: '',
            filename: '[name].bundle.js'
        },
        devServer: {
            openPage: 'index.html',
            open: true, // auto open browser?
            contentBase: './',
            noInfo: true,
            port: 3456,
            // inline: true,
            // stats: 'minimal',
            // watchOptions: {
            //     aggregateTimeout: 300,
            //     poll: 1000
            // }
        },
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.html$/,
                    exclude: [/node_modules/],
                    // loader:
                    // "html-loader?minimize=true&removeComments=false&conservativeCollapse=true&col
                    // l apseWhitespace=true"
                    loader: "html-loader"
                }, {
                    test: /\.js$/,
                    exclude: [/node_modules/],
                    loaders: ['babel-loader']
                }, {
                    test: /\.scss$/,
                    exclude: [/node_modules/],
                    
                    loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!sass-loader'})
                }, {
                    test: /\.css$/,
                    exclude: [/node_modules/],
                    loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
                }
            ]
        },
        resolve: {
            extensions: ['.js']
        },
        externals: {}
    }
};

//usage example: include: [getPath('src/assets/styles')],
function getPath(relativePath) {
    return path.join(__dirname, relativePath);
}