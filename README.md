# weex-project-boilerplate

> 这是一套自定义的weex项目模板，已fork在vue-cli的分支上，可通过vue init varSmallRookie/weex-template <name>进行安装

``` 
vue init varSmallRookie/weex-template <name>
cd <name>
npm install or yarn
npm run start
```

## Documentation

- 项目本身已设置为每一个weex页面生成一个bundlejs文件，即page文件下的.vue文件
- 项目已配置prod与test环境，项目初始化后应首先配置webpack.prod.conf.js与webpack.test.conf.js中的阿里云cdn配置信息

``` 
process.env.cdnUrl = '';//阿里云上传路径
...
new AliyunOSSPlugin({//阿里云上传插件
    accessKeyId: '',
    accessKeySecret: '',
    region: '',
    bucket: ''
}),
```

将在打包过程中配合webapck插件自动将bundlejs进行上传
-项目默认不产生web的相关代码，如需打开，请将webpack.prod.conf.js与webpack.test.conf.js的导出方式改为如下

``` 
module.exports = [weexConfig, webConfig]
```

:warning: 打包后的页面对应的url将写入在src/pageMap.js中，而且进行了加密，如需取消加密，请将customWeexConfig.js中的如下代码注释


``` 
// 如果不需要加密请注释以下代码
let token = random_string(16);//生成token
stringifyStr = xtea.xTEAEncryptWithKey(pageUrl, token);//进行加密
stringifyStr = toBuffer(stringifyStr);//将arrayBuffer转为Buffer
stringifyStr = new Buffer(token).toString('hex')+stringifyStr.toString('hex');//提取值
```
