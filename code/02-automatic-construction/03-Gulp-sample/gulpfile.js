// gulp 的入口文件
const {series, parallel} = require('gulp')
const fs = require('fs')

exports.foo = done => {
    console.log('gulp')

    done() // 标识任务完成
}

exports.default = done => {
    console.log('defult')

    done()
}

// 4.0以前的使用方法
// const gulp = require('gulp')

// gulp.task('bar', done => {
//     console.log('bar')
//     done()
// })

// ==========================
// 组合任务
const task1 = done => {
    setTimeout(() => {
        console.log('task1')
        done()
    }, 1000);
}
const task2 = done => {
    setTimeout(() => {
        console.log('task2')
        done()
    }, 1000);
}
const task3 = done => {
    setTimeout(() => {
        console.log('task3')
        done()
    }, 1000);
}

// 使用series方法组合任务，等上个任务结束后执行下个任务
exports.tasks1 = series(task1, task2, task3)
// 会同时执行内部的任务
exports.tasks2 = parallel(task1, task2, task3)

// ==========================
// 三种异步任务

// 1.通过回调方法
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

// 2.通过返回Promise对象
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

// 3.使用 async/await (node在8.0以上)
const time = time => {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    })
}
exports.async = async () => {
    await time(1000)
    console.log('async')
}

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