const {src, dest, parallel} = require('gulp')
// 处理sass文件，转换成css文件
const sass = require('gulp-sass')
// 处理js文件，转换es6语法，还需安装 @babel/core 和 @babel/preset-env
const babel = require('gulp-babel')
// 转换 swig 的模板文件
const swig = require('gulp-swig')

// 样式编译 gulp-sass
const style = () => {
  // 文件名不能以 _ 开头，会被认为是依赖文件而不转换
  return src('src/assets/styles/*.scss',{base: 'src'})
    // outputStyle:'expanded' 生成完全展开的代码
    .pipe(sass({ outputStyle:'expanded'}))
    .pipe(dest('dist'))
}

// 脚本编译 gulp-babel
const script = () => {
  return src('src/assets/scripts/*.js',{base: 'src'})
    // presets: ['@babel/preset-env'] 将js新特性转换
    // 只会转换 @babel/preset-env 的特性
    .pipe(babel({ presets: ['@babel/preset-env']}))
    .pipe(dest('dist'))
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
    .pipe(swig({data}))
    .pipe(dest('dist'))
}

// 创建组合任务
const compile = parallel(style, script, page)

module.exports = {
  style,
  script,
  page,
  compile 
}