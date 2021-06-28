const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
// const envIsProd = process.env.NODE_ENV === "production";
// proxy = {
//   "/": {
//     target: process.env.VUE_APP_BUSINESS_URL,
//     changeOrigin: true,
//     pathRewrite: {
//       api: ""
//     }
//   }
// };

module.exports = {
  pluginOptions: {},
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "",
  indexPath: "index.html",
  filenameHashing: true,
  pages: undefined,
  lintOnSave: "default",
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: true,
  crossorigin: undefined,
  integrity: false,
  configureWebpack: config => {
    const plugins = [];
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
    }
    config.plugins = [...config.plugins, ...plugins];
  },
  chainWebpack: config => {
    config.resolve.symlinks(true);
    config.plugin("html").tap(args => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    });
    config.resolve.alias // 添加别名
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@components", resolve("src/components"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"));
    if (IS_PROD) {
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static"
        }
      ]);
    }
  },
  devServer: {
    overlay: {
      warnings: true,
      errors: true
    },
    host: "localhost",
    port: 3003,
    https: false,
    open: true,
    hotOnly: true,
    // proxy,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
};
