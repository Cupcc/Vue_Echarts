module.exports = {
  devServer: {
    port: 8999,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8999',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  }
};
