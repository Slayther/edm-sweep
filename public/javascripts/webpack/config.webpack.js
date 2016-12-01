module.exports = {
    entry: {
        app1: './../index.js',
        app2: './../index2.js'
    },
    output: {
        path: './../build',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.css/,
                loader: 'style!css'
            }
        ]
    }
}