const path = require("path");
module.exports = {
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' }
    ]
  }
};
