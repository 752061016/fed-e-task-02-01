#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer') // 命令行交互依赖
const ejs = require('ejs') // ejs 模板引擎依赖

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'your name'
    },
    {
        type: 'input',
        name: 'projectName',
        message: 'project name'
    }
])
.then(data => {

    // 获取当前命令行的路径
    const destDir = process.cwd()
    
    // 获取模板目录的路径
    const tmplDir = path.join(__dirname, '../templates')

    // 读取模板文件夹中的文件
    fs.readdir(tmplDir, (err,files) => {
        if (err) throw err
        // 遍历每个模板文件
        files.forEach(file => {
            // 使用 ejs 将命令行交互输入模板
            ejs.renderFile(path.join(tmplDir, file), {
                name: data.name,
                projectName: data.projectName,
                time: new Date().toLocaleString()
            }, (err, result) => {
                if (err) throw err
                // 回调接收转换后的模板，并输出到命令行路径
                fs.writeFileSync(path.join(destDir, file), result)
            })
        })
    })
})