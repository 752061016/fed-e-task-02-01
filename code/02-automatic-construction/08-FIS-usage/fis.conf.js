fis.match('*.{js,scss,png}', {
    release: '/assets/$0'
})

// 转换sass文件
fis.match('**/*.scss', {
    rExt: 'css', // 修改后缀名
    parser: fis.plugin('node-sass'),
    optimizer: fis.plugin('clean-css') // 压缩css文件
})

// 转换js文件
fis.match('**/*.js', {
    parser: fis.plugin('babel-6.x'),
    optimizer: fis.plugin('ugliffy-js') // 压缩js文件
})