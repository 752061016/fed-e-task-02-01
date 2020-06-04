// Grunt 入口文件
// 用于定义一些需要 Grunt 自动执行的任务
// 需要导出一个函数
// 此函数接收一个 grunt 的形参，内部提供一些创建任务时可以用到的 API

const sass = require('sass')
const loadGruntTasks = require('load-grunt-tasks')

module.exports = grunt => {
    // 接收两个参数，方法名和执行函数
    grunt.registerTask('foo', () => {
        console.log('hello foo')
        return false
    })

    // 若传入三个参数，第二个参数会作为帮助信息显示
    // 帮助信息会在 help 中显示
    grunt.registerTask('bar', '帮助信息', () => {
        console.log('hello bar')
    })

    // 若方法名为default，则不需要再写入名字，直接使用 yarn grunt
    // 一般会在第二个参数内传入数组依次执行多个任务
    grunt.registerTask('default', ['async-task', 'foo', 'bar'])

    // 执行 async-task 方法时未打印
    // grunt.registerTask('async-task', () => {
    //     setTimeout(() => {
    //         console.log('async-task')
    //     }, 1000);
    // })

    // 异步任务不能使用箭头函数,因为内部需要调用this
    grunt.registerTask('async-task', function () {
        const done = this.async()
        setTimeout(() => {
            console.log('async-task')
            done(false)
        }, 1000);
    })

    // 配置选项方法
    grunt.initConfig({
        config: 'sss',
        foo: {
            bar: 123
        },
        build: {
            options: {
                name: '配置选项'
            },
            css: {
                options: {
                    name: 'css'
                }
            },
            js: '2'
        },
        clean: {
            js: 'temp/app.js', // 删除app.js文件
            css: 'temp/*.css', // 删除所有css文件
            over: 'temp/**'    // 删除所有文件
        },
        sass: {
            options: {
                implementation: sass,
                sourceMap: true
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        },
        babel: {
            options: {
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },
        watch: {
            js: {
                files: ['src/js/app.js'],
                tasks: ['babel']
            },
            css: {
                files: ['src/scss/main.scss'],
                tasks: ['sass']
            }
        }
    })

    grunt.registerTask('config', () => {
        // 打印 initConfig 中的 config 值
        console.log(grunt.config('config'))  // sss
        console.log(grunt.config('foo.bar')) // 123
    })

    // 多目标任务 可以让任务根据配置形成多个子任务
    // grunt build 执行两次 target:css,data:[object Object]  target:js,data:2
    // grunt build:css 执行一次 target:css,data:1
    grunt.registerMultiTask('build', function () {
        console.log(this.options()) // { name: 'css' } { name: '配置选项' } 
        console.log(`target:${this.target},data:${this.data}`)
    })

    // 插件的使用
    // grout-contrib-clean 清除产生的临时文件
    // 需要在 grunt.initConfig 配置选项内配置 clean 对象
    // grunt.loadNpmTasks('grunt-contrib-clean')

    // sass 
    // grunt.loadNpmTasks('grunt-sass')

    // babel
    // grunt.loadNpmTasks('grunt-sass')

    loadGruntTasks(grunt) // 自动加载所以的 grout 插件

    // 定义一个指令在watch前先执行 sass 和 babel
    grunt.registerTask('start', ['sass', 'babel', 'watch'])
}
