// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env = {}) => {
    const isProduction = process.env.NODE_ENV === "production";
    const currentEnv = env.mir || "mcc"; // Use env.mir, default to 'mcc'

    const config = {
        entry: "./src/index.ts",
        output: {
            path: path.resolve(__dirname, "dist"),
        },
        devServer: {
            open: true,
            host: "localhost",
            port: 9000,
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "index.html",
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
            }),
            new webpack.DefinePlugin({
                ENVIRONMENT: JSON.stringify(currentEnv), // Inject the 'mir' environment variable
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/i,
                    loader: "ts-loader",
                    exclude: ["/node_modules/"],
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                    type: "asset",
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    type: "asset/resource",
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
            fallback: {
                crypto: false,
            },
        },
    };

    if (isProduction) {
        config.mode = "production";
        config.devtool = "source-map";
    } else {
        config.mode = "development";
    }

    return config;
};
