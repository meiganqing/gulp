
## 项目结构
    源代码必须放入项目文件夹下src文件夹内，和src文件同级的还应放入.babelrc文件、gulpfile.js文件以及package.json文件
   同时需要在.gitignore文件夹内配置上传git的文件限制，例如安装好的本地包node_modules可以不用上传git


   *注  src文件夹内只允许有
   page  存放html 按模块存放
   js    存放js 与page结构相对应
   css   存放css 与page结构相对应
   images   存放图片
   Widget   存放所有的第三方包 此文件夹在打包时不会被压缩，会直接复制进打包文件夹

   *注
   src文件夹内  page js css  文件夹内会自动打包；
                images Widget 文件夹内会自动复制；
   
   如若增加其他文件夹需要自动打包或复制时，需要进入gulpfile.js进行相关修改；
## 前序准备

你需要在本地安装 [node](http://nodejs.org/) 和 [gulp]  npm install -g gulp。


## 开发命令如下

```bash

# 安装依赖
npm install

# 启动本地服务
gulp
```
## 打包命令如下

```bash
# 拷贝源码到调试文件夹
gulp write

# 给文件加版本号
gulp rev

# 打包文件
gulp build
```

## 清除文件

```bash
# 删除掉调试和打包文件
gulp clean

```

## 备注
需要更改 node_modules以下文件
①. 打开node_modules\gulp-assets-rev\index.js
    其中的： var verStr = (options.verConnecter || "-") + md5;
   更新为：var verStr = (options.verConnecter || "") + md5;
   其次： src = src.replace(verStr, '').replace(/(\.[^\.]+)$/, verStr + "$1");
   更新为：src=src+"?v="+verStr;
②.打开node_modules\gulp-rev\index.js
    其中的： manifest[originalFile] = revisionedFile;
   更新为： manifest[originalFile] = originalFile + '?v=' + file.revHash;
   其中的：file.revHash = revHash(file.contents)
   更新为：file.revHash = revHash(file.contents)+new Date().getTime();
③. 打开node_modules\gulp-rev-collector\index.js
   找到： var cleanReplacement =  path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' );
    更改为：var cleanReplacement =  path.basename(json[key]).split('?')[0];
     其次找到： regexp: new RegExp( prefixDelim + pattern, 'g' ),
      更改为： regexp: new RegExp( prefixDelim + pattern + '(\\?v=\\w{10})?', 'g' ),

④. 打开node_modules\rev-path\index.js
   其中的：return modifyFilename(pth, (filename, ext) => `${filename}-${hash}${ext}`);
   更新为： return modifyFilename(pth, (filename, ext) => `${filename}${ext}`);



