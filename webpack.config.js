var webpack           = require('webpack'),
    path              = require('path'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        // Compiler ID
        name: 'desktop',
        
        // Makes sure errors in console map to the correct file and line number
        devtool: 'eval',

        // Define entry points
        entry: {
            // App entry point
            app: [
                // For hot style updates
                'webpack/hot/dev-server', 

                // The script refreshing the browser on none hot updates
                'webpack-dev-server/client?http://localhost:8080', 

                // Main app
                path.resolve(__dirname, 'app', 'index.jsx')
            ],

            // Common vendor packages
            vendor: [
                'underscore',
                'react/addons',
                'flummox'
            ]
        },
        
        // Set modules output
        output: {
            path: path.resolve(__dirname, 'public', 'dist'),
            publicPath: '/dist/',
            filename: 'bundle.js'
        },
        
        // Define module loaders
        module: {
            loaders: [
                {   // ES6 Loader
                    test: /\.jsx?$/, 
                    exclude: /(node_modules|bower_components)/, 
                    loader: 'babel?optional[]=runtime'
                },

                {   // JADE Loader
                    test: /\.jade$/, 
                    loader: 'jade'
                },

                {   // CSS Loader
                    test: /\.css$/,  
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
                },
                
                {   // LESS Loader
                    test: /\.less$/, 
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
                },

                {   // SASS Loader
                    test: /\.scss$/, 
                    loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
                }
            ]
        },

        // Setting up resolution
        resolve: {
            modulesDirectories: [
                'node_modules',
                'resources'
            ],
            extensions: ['', '.js', '.jsx']
        },

        // Set up plugins
        plugins: [            
            // Define module globals
            new webpack.ProvidePlugin({
                '_': 'underscore',
                'React': 'react',
                'Component': 'flummox/component'
            }),

            // Deduplication
            new webpack.optimize.DedupePlugin(),


            // Chunk out vendor code
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),

            // Extract CSS files
            new ExtractTextPlugin("styles.css"),

            // Hot module replacement
            new webpack.HotModuleReplacementPlugin()
        ]
    }
];