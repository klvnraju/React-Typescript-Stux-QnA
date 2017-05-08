var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: './public/css/index.css'
});

module.exports = {
  entry: "./app/app.tsx",
  output: {
    filename: "./public/js/app/bundle.js",
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    rules: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, use: ["source-map-loader"], enforce: "pre" },
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, use: ["ts-loader"] },
      {
        test: /\.scss$/,
        use: extractSass.extract({
            use: [{
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
            }, {
                loader: "sass-loader",
                options: {
                  sourceMap: true
                }
            }],
            // use style-loader in development
            fallback: "style-loader"
        })
      }
    ]
  },
  plugins: [
        extractSass
  ]
};