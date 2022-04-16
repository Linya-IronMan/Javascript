const path = require("path");
const dist = path.resolve(__dirname, "./");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: {
        ".": "./index.ts",
        "components/card": "./components/card/index.ts",
        "components/button": "./components/button/index.ts",
    },
    mode: "production",
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.js$/,
                terserOptions: {
                    keep_classnames: true,
                    keep_fnames: true,
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    output: {
        filename: "[name]/index.js",
        path: dist,
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: "ts-loader",
            exclude: /node_modules/,
        }, ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
        contentBase: dist,
        compress: false,
        port: 8083,
        host: "0.0.0.0",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "index.html",
            inject: false,
        }),
    ],
};