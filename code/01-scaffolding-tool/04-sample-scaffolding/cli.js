#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头
// 如果是 Linux 或 maxOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

// console.log('cli working!')

// 脚手架的工作过程
// 1.通过命令行交互询问用户问题
// 2.根据用户回答的结果生成文件


const fs = require('fs')
const path = require('path')
// 安装 inquirer 模块 npm i inquirer -D
const inquirer = require('inquirer') // 命令行交互
// 安装 ejs 模板引擎模块 npm i ejs -D
const ejs = require('ejs')

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'name?',
    }
])
.then(answers => {
    // 接收用户所有的回答
    // 根据用户回答的结果生成文件

    // 模板目录
    const tmplDir = path.join(__dirname, 'templates')

    // 目标路径
    const destDir = process.cwd()

    // 将模板下的文件全部转换到目标目录
    fs.readdir(tmplDir, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            // file 为相对路径
            // 通过模板引擎生成文件
            // ejs.renderFile 接收三个参数， 模板绝对路径，ejs参数，回调
            ejs.renderFile(path.join(tmplDir, file), answers, (err, result) => {
                if (err) throw err

                // result为成功结果，也就是修改后的模板
                // console.log(result)
                // 将模板写入目标文件
                fs.writeFileSync(path.join(destDir, file), result)
            })
        });
    })
})