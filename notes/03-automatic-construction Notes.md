# 自动化构建
##### 一切重复工作本应自动化
##### 将开发阶段写出来的源代码自动化地转换成生产环境中可以运行的代码，称作：自动化构建工作流，作用：脱离运行环境兼容带来的问题，使用提高效率的语法、规范和标准
+ 开发网页时就可使用：
  + ECMAScript Next
  + Sass
  + 模板引擎
##### 这些用法大都不被浏览器直接支持，通过自动化构建的方式构建转换那些不被支持的特性，在开发时就能提高编码效率
### 自动化构建使用
##### 例如：为文件添加Sass文件，每次都需要通过手动地指令sass将文件修改成css文件
#### NPM Scripts
##### 使用 NPM Scripts 添加 package.json 中的 script 字段为自动化地执行指令，这是实现自动化构建工作流的最简方式
+ 安装 sass 模块
+ 添加 build 命令："build": "sass scss/main.scss css/main.css" 将 sass 文件转换成 css 文件
+ 安装 browser-sync 模块，自动开启一个本地服务器并打开浏览器
+ 添加 serve 命令：browser-sync . 打开当前目录html文件
##### 但若是在打开前sass文件未转换，则无法看到相应的样式修改，使用需要在serve命令前执行build命令
+ 使用 NPM Script 的钩子机制，定义preserve，在执行某个命令之前先执行该命令
+ 在serve前添加:"preserve": "npm run build"  
+ 会在启动 serve 命令前执行 build 命令
+ --watch 监听文件的改变
  + 在 sass 命令后添加 --watch 会监听文件的改变，文件改变后则自动编译
  + 这样在运行 sever 时，build在工作时会发生阻塞，等待文件的变化，以致于后续指令无法运行
  + 安装 npm-run-all 模块
  + 可以使用 run-p 同时执行 build 和 serve 两个指令
  + 此时两个命令同时被执行，且修改 sass 文件，会立刻被编译成 css 文件
+ --files 监听项目下的文件
  + 在 browser-sync 命令后添加 --files \" 文件路径 \" 监听文件内容的变化
  + 当文件内容改变时 browser-sync 会将文件内容自动同步到浏览器中，从而更新浏览器的页面，避免手动重复刷新浏览器的工作
### 常用的自动化构建工具
+ Grunt 最早的前端构建系统，插件生态完善，插件几乎可以自动化完成任何事，但由于工作过程是基于临时文件去实现的，所以说构建速度较慢。例如sass编译，会在每个步骤都生成一个临时文件用于处理，处理环节越多速度越慢
+ Gulp 解决Grunt构建速度较慢的问题，因为是基于内存实现的，对文件的处理环节都是在内存中完成的，相当于磁盘读写速度更快，而且支持同时执行多个任务，效率上大大提高，使用方式相当于Grunt更加易懂，生态也很完善
+ FIS 百度的前端团队推出的构建系统，将典型的需求尽可能地集成在内部，例如：能很轻松的处理资源加载、模块化开发、代码部署、性能优化等，功能大而全，在国内流行
+ FIS 给适合新手，Grunt和Gulp更灵活多变
##### webpack严格来说是一个模块打包工具，不算在自动化构建工具范围内
### Grunt
##### Grunt 使用
+ 创建新文件初始化 package.json
+ 添加 grunt 模块：npm i grunt -D
+ 创建 gruntfile.js 入口文件，定义一些需要 Grunt 自动执行的任务
+ 运行 grunt 命令：用 yarn 直接使用：yarn grunt <name> , 用 npm 得需安装 grunt-cli 再使用：grunt <name>
+ grunt.registerTask 方法默认执行同步任务，若在执行内传入异步任务则不会被执行
+ 异步任务不能使用箭头函数,因为内部需要调用this，内部调用 this.async() 方法，在异步任务结束后再调用一次这个方法的返回值用来执行异步任务,会等待done的执行才会继续执行
### Grunt 标记任务失败
+ grunt 中可以在执行函数内通过 return false 来标记任务失败
+ 如果在任务列表中其中一个任务被标记了失败后，则后续任务将不再执行
+ 如果希望所有的任务都执行可以在命令行后添加 --force ,这样遇到任务失败也不会停止，会将所有任务都执行一遍
+ 在异步任务中通过在 done 方法中输入 false 来标记任务失败
### Grunt 配置选项方法
+ 使用 grunt.initConfig 方法传入参数作为配置参数
+ 通过 grunt.config(<key>) 来获取该值
### Grunt 多目标任务
+ 使用 grunt.registerMultiTask 方法创建任务
+ 会根据 grunt.initConfig 方法中同名的对象，根据对象中的数据个数执行几次
+ 可以在控制台时在任务后加:<key> : grunt <name>:<key> ,会根据单个数据执行一次
+ 可以在方法内通过 this.target 和 this.data 分别拿到此次执行的 target 和 data
+ 在 grunt.initConfig 添加的 options 是不会按正常键值执行，这是当前对象的配置选项，可以通过 this.options() 方法来获取所有的配置选项
+ 目标值也可以是对象，也能传入 options 对象，在轮到该目标执行时，该目标中的 options 会替换掉主对象中的 options
### Grunt 插件的使用
##### Grunt 的核心就是插件，插件是通用的，插件内部封装了通用的构建任务
+ 先在 npm 中安装插件
+ 再到 Gruntfile.js 中载入插件提供的任务
+ 最后根据插件的文档配置选项
##### grunt-contrib-clean 清除项目开发过程中产生的临时文件
+ 在 npm 中添加模块：yarn add grunt-contrib-clean
+ 在 Gruntfile.js 中载入插件提供的任务：grunt.loadNpmTasks('grunt-contrib-clean')
+ 还需要在 grunt.initConfig 方法内配置 clean 对象，对象的值为需要删除的文件路径
+ 在控制台执行命令即可删除文件：grunt clean
+ 也可以在文件路径中写入通配符，会删除匹配的文件
### Grunt 常用插件及总结
##### grunt-sass 转换sass文件
+ 安装 grunt-sass 和 sass 依赖：yarn add grunt-sass sass
+ Gruntfile.js 中载入插件提供的任务: grunt.loadNpmTasks('grunt-sass')
+ 在 grunt.initConfig 方法内配置 sass 对象
  + options 配置参数的 implementation 需要为 sass 的依赖，sourceMap 为 true 时会自动生成 map 类型文件
  + main 配置文件：files 配置文件的入口(值)和出口(键)
+ 运行 grunt sass 自动转换对应的 sass 文件
##### grunt-babel 转换es6语法
+ 安装 grunt-babel 和 babel 依赖：yarn add grunt-babelyarn add v1.22.4bel/preset-env
+ 在 grunt.initConfig 方法内配置 babel 对象
  + options 的 presets 传入依赖
  + main 的 files 配置文件的入口(值)和出口(键)
+ 运行 grunt babel 自动转换对应的 sass 文件
##### load-grunt-tasks 减少loadNpmTasks的使用
##### grunt-contrib-watch 监听文件的修改
+ 安装 grunt-contrib-watch 依赖：yarn add grunt-contrib-watch
+ 在 grunt.initConfig 方法内配置 watch 对象
  + watch 对象中包含对象，对象的 files 接收数组监听内部所有文件的监听，tasks 接收数据在文件修改后执行数组内的指令
+ 运行 grunt watch 开启文件监听，但文件发生修改时就会执行相应的指令
+ 一般会做一个映射，在开启后先执行一遍指令再执行监听
### Gulp
##### 基本使用
+ 初始化 package.json
+ 安装 Gulp 依赖： yarn add gulp
+ 创建 gulpfile.js
+ 导出一个方法，方法内部为执行指令
+ 因为4.0取消了同步方法，都采用异步的方法执行，所以需要在结尾执行回调标记结束
#### Gulp 创建组合任务
+ 使用 series 和 parallel 方法可以创建组合任务
+ series 内部的任务会在上个任务成功结束后才执行下个任务
+ parallel 内部的任务会在同一时间开始执行
#### Gulp 异步任务的三种方式
1. 在任务结束时调用回调函数done标记结束，如果在done方法中传入错误，则任务会被终止
```javascript
// 成功回调
exports.callback1 = done => {
    console.log('callback')
    done()
}
// 失败回调
exports.callback2 = done => {
    console.log('callback')
    done(new Error('failed'))
}
```
2. 在方法中 return 一个Promise对象，当传入的是失败的Promise对象，也会终止后续任务
```javascript
// 成功回调
exports.promise1 = () => {
    console.log('promise1')
    return Promise.resolve()
}
// 失败回调
exports.promise2 = () => {
    console.log('promise2')
    return Promise.reject()
}
```
3. 使用 async/await 将任务定义成异步任务(node在8.0以上)
```javascript
const time = time => {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    })
}
exports.async = async () => {
    await time(1000)
    console.log('async')
}
```
+ 示例：读取文件并写入新文件
```javascript
// 成功执行，实际上在内部readStream中为事件注册了done事件
exports.stream = () => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('text.txt')
    readStream.pipe(writeStream)
    return readStream
}
// 等同于
exports.stream2 = done => {
    const readStream = fs.createReadStream('package.json')
    const writeStream = fs.createWriteStream('text.txt')
    readStream.pipe(writeStream)
    readStream.on('end', () => {
        done()
    })
}
```
### Gulp 构建过程核心工作原理
+ 过程
  + 输入：读取文件
  + 加工：压缩文件
  + 输出：写入文件
```javascript
const fs = require('fs')
const {Transform} = require('stream')

exports.default = () => {
    // 文件读取流
    const read = fs.createReadStream('main.css')
    // 文件写入流
    const write = fs.createWriteStream('main.min.css')
    // 文件转换流
    const transform = new Transform({
        transform: (chunk, encoding, callback) => {
            // 核心转换过程
            // chunk => 读取流中读取到的内容
            const input = chunk.toString()
            const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
            callback(null, output)
        }
    })

    // 把读取出来的文件导入写入文件流
    read
        .pipe(transform) // 转换
        .pipe(write)     // 写入

    return read
}
```
#### Gulp 文件操作 API
+ 相比于原生的 API ，gulp中提供了更为简单强大的 API 用于操作
+ 还可以使用通配符匹配所有符合的文件
+ 若想压缩文件可以使用插件，如 gulp-clean-css 压缩css文件、gulp-rename 重命名扩展名
```javascript
// gulp 文件操作 API
const {src, dest} = require('gulp')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')

exports.gulp_api = () => {
    return src('src/*.css')
        .pipe(cleanCss())
        .pipe(rename({extname: 'min.css'}))
        .pipe(dest('dist'))
}
```
### Gulp 案例-自动化构建网页应用自动化工作流
+ demo结构
  + pubilc 不需要被加工，直接拷贝的文件
  + src 开发代码，所有文件都会被转换
+ 安装 gulp 依赖模块
#########


