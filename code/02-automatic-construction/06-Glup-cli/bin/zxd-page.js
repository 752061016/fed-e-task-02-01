#!/usr/bin/env node

// console.log('zxd')
// process.argv 获得路径和参数的数据
process.argv.push('--cwd')
process.argv.push(process.cwd())
process.argv.push('--gulpfile')
process.argv.push(require.resolve('..'))

require('gulp/bin/gulp')