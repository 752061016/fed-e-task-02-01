// Plop 入口文件，需要导出一个函数
// 此函数接收一个 plop 对象，用于创建生成器任务

module.exports = plop => {
    // component 为生成器名字
    plop.setGenerator('component', {
        description: 'create a component', // 描述
        prompts: [ // 命令行问题
            {
                type: 'input', // 输入方式
                name: 'name', // 键名
                message: 'component name', // 描述信息
                default: 'MyComponent' // 默认值
            }
        ],
        actions: [ // 动作指令
            {
                type: 'add', // 添加一个新文件
                path: 'src/components/{{name}}/{{name}}.js', // 保存路径，双括号可以保存键名
                templateFile: 'plop-templates/component.hbs' // 模板文件路径
            },{
                type: 'add', // 添加一个新文件
                path: 'src/components/{{name}}/{{name}}.css', // 保存路径，双括号可以保存键名
                templateFile: 'plop-templates/component.css.hbs' // 模板文件路径
            },{
                type: 'add', // 添加一个新文件
                path: 'src/components/{{name}}/{{name}}.test', // 保存路径，双括号可以保存键名
                templateFile: 'plop-templates/component.test.hbs' // 模板文件路径
            }
        ]
    })
}