module.exports = {
    webpack: {
        configure: {
            devtool: "eval-source-map",
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        resolve: {
                            fullySpecified: false,
                        },
                    },
                ],
            },
        },
    },
};
