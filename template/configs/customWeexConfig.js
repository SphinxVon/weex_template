/**
 * @module
 * @description
 * @version 1.0.0
 * @author varSmallRookie
 * @date 2018/2/23
 */
var url     = require('url');
var http    = require('http');
var fs      = require('fs');
var _       = require('lodash');
var async   = require('async');
var pathTo  = require('path');
var xtea    = require('customize_xtea');//加密
var cdnUrl  = process.env.cdnUrl;//阿里云上传路径

function toBuffer(ab) {//arrayBuffer to buffer
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}
function toArrayBuffer(buf) {//buffer to arrayBuffer
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return ab;
}

function customWeexConfig(options) {};//构造函数
customWeexConfig.prototype.apply = function (compiler) {//插件工作钩子
  compiler.plugin("make", function(compilation, callback) {// 打包前的钩子函数
    fs.readFile(__dirname+'/../src/pageMap.js', 'utf8', function (err,data) {//读取页面配置文件
      if (err) {//读取文件出错啦
        return console.log(err);
      }
      let pageMapObj = {};//保存页面与url映射数据
      fs.readdirSync(pathTo.join(__dirname, '/../src', 'page')).forEach(function(file) {//读取page下面的所有文件夹
        if (/\.vue$/g.test(file)) {
          let pageUrl = cdnUrl+'page/'+file.split('.vue')[0]+'_'+process.env.token+'.js';//拼接成上传的路径
          let stringifyStr = pageUrl;
          // 如果不需要加密请注释以下代码
          let token = process.env.token;//生成token
          stringifyStr = xtea.xTEAEncryptWithKey(pageUrl, token);//进行加密
          stringifyStr = toBuffer(stringifyStr);//将arrayBuffer转为Buffer
          stringifyStr = new Buffer(token).toString('hex')+stringifyStr.toString('hex');//提取值

          pageMapObj[file.split('.vue')[0]] = stringifyStr;
        }
      })
      //重新写入配置文件
      let content = `export default ${JSON.stringify(pageMapObj).replace(/\,/g,',\n').replace(/\{/g,'{\n').replace(/\}/g,'\n}')}`;
      fs.writeFile(__dirname+'/../src/pageMap.js', content, 'utf8', function (err) {
         if (err) return console.log(err);
      });
      callback();
    });
  });

  compiler.plugin('emit', function (compilation, callback) {// 打包但还未生成文件钩子
    callback();
  }.bind(this));
}

module.exports = customWeexConfig;
