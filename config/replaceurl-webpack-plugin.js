class ReplaceUrlWebpackPlugin {
  apply(compiler) {

    // 注册自定义插件钩子到生成资源到 output 目录之前，拿到compilation对象（编译好的stream）
    compiler.hooks.emit.tap('ReplaceUrlWebpack', compilation => {
        Object.keys(compilation.assets).forEach(item => {
          if(/\.js$/.test(item)){
            let content = compilation.assets[item].source();
            content = content.replace(/192\.168\.50\.12/g, '120.48.9.247')
            content = content.replace(/192\.168\.10\.12/g, '120.48.9.247')
            content = content.replace(/localhost/g, '120.48.9.247')
            compilation.assets[item] = {
              source: () => content,
              size: () => content.length
            }
          }            
        });
    });
}
}
module.exports = ReplaceUrlWebpackPlugin;
