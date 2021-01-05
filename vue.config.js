module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.dhon$/,
                    loader: 'raw-loader',
                    exclude: /(node_modules)/,
                }
            ]
        }
    }
}