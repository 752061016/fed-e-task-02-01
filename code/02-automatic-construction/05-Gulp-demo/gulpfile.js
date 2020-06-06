const {src, dest, parallel, series, watch} = require('gulp')
// 删除文件插件
const del = require('del')
// 处理sass文件，转换成css文件
const sass = require('gulp-sass')
// 处理js文件，转换es6语法，还需安装 @babel/core 和 @babel/preset-env
const babel = require('gulp-babel')
// 转换 swig 的模板文件
const swig = require('gulp-swig')
// 转换图片
const imagemin = require('gulp-imagemin')

// 自动载入插件
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()

// 热更新插件
const browserSync = require('browser-sync')
// 自动创建开发服务器
const bs = browserSync.create()

// 样式编译 gulp-sass
const style = () => {
  // 文件名不能以 _ 开头，会被认为是依赖文件而不转换
  return src('src/assets/styles/*.scss',{base: 'src'})
    // outputStyle:'expanded' 生成完全展开的代码
    .pipe(sass({ outputStyle:'expanded'}))
    .pipe(dest('dist'))
    .pipe(bs.reload({stream: true}))
}

// 脚本编译 gulp-babel
const script = () => {
  return src('src/assets/scripts/*.js',{base: 'src'})
    // presets: ['@babel/preset-env'] 将js新特性转换
    // 只会转换 @babel/preset-env 的特性
    .pipe(babel({ presets: ['@babel/preset-env']}))
    .pipe(dest('dist'))
    .pipe(bs.reload({stream: true}))
}

const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}
// 模板编译
const page = () => {
  return src('src/*.html', {base: 'src'})
    // data 插入模板的配置选项
    // cacha:false 防止模板引擎缓存机制导致页面不变化
    .pipe(swig({data,defaults:{cache:false}}))
    .pipe(dest('dist'))
    .pipe(bs.reload({stream: true}))
}

// 图片文件压缩转换
const image = () => {
  return src('src/assets/images/**', {base: 'src'})
    .pipe(imagemin())
    .pipe(dest('dist'))
}

// 字体文件压缩转换
const font = () => {
  return src('src/assets/fonts/**', {base: 'src'})
    .pipe(imagemin())
    .pipe(dest('dist'))
}

// 不需要转换的文件
const extra = () => {
  return src('public/**', {base: 'public'})
    .pipe(dest('dist'))
}

// 清除文件
const clean = () => {
  return del(['dist'])
}

// 创建 serve 任务，以 dist 文件夹为热更新目录
const serve = () => {
  // watch 方法接收两个参数 监听的路径和执行的命令
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/scripts/*.js', script)
  watch('src/*.html', page)
  // watch('src/assets/images/**', image)
  // watch('src/assets/fonts/**', font)
  // watch('public/**', extra)
  watch([
    'src/assets/images/**',
    'src/assets/fonts/**',
    'public/**'
  ], bs.reload) // bs.reload 浏览器重新发起请求

  bs.init({
    // 弹出提示是否连接完毕
    notify: false,
    // 默认端口
    port: 2020,
    // 监听文件的修改自动热更新， dist下所有文件被修改会自动更新
    files: 'dist/**',
    // 是否自动打开网页
    open: false,
    server: {
      // 如果文件找不到，则会向后进行查找
      baseDir: ['dist', 'src', 'public'],
      // 将所有对键的请求路径都改为值的路径
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  })
}

// 引用依赖
const useref = () => {
  return src('dist/*.html', {base: 'dist'})
    .pipe(plugins.useref({searchPath: ['dist', '.']}))
    .pipe(dest('dist'))
}

// 创建组合任务
const compile = parallel(style, script, page, image, font)

// 上线前执行的任务
const build = series(clean, parallel(extra, image, font, compile)) 

const develop = series(compile, serve)

module.exports = {
  style,
  script,
  page,
  image,
  font,
  extra,
  clean,
  serve,
  useref,
  compile,
  build,
  develop
}