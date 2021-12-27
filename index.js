#!/usr/bin/env node
// 命令行参数解析
const program = require('commander');
// 引入shelljs，shelljs模块重新包装了child_process,调用系统命令更加简单
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const inquirer = require('inquirer');

program.version('1.0.0', '-v, --version')
  .command('init <name>')
  .action((name) => {
    console.log(name);
    if (!fs.existsSync(name)) {
      console.log('\u001b[32m 正在创建项目... \u001b[0m');
      inquirer.prompt([
        {
          name: 'description',
          message: '请输入项目描述：'
        },
        {
          name: 'author',
          message: '请输入作者名称：'
        }
      ]).then(answers => {
        console.log('\u001b[32m 正在初始化模板... \u001b[0m');
        child_process.exec('git clone git@github.com:queuecat/template-vue.git', function (err, stdout, stderr) {
          if (err) {
            console.log('\u001b[31m 模板下载失败 \u001b[0m');
          } else {
            // 清除代码仓库
            shell.rm('-r', path.resolve('./', 'template-vue', '.git'));
            shell.mv('template-vue', path.resolve('./', name));
            const filename = `${name}/package.json`;
            const meta = {
              name,
              description: answers.description,
              author: answers.author
            };
            console.log(filename, path.resolve('./', filename));
            if (fs.existsSync(path.resolve('./', filename))) {
              const content = fs.readFileSync(filename).toString();
              let dt = JSON.parse(content);
              for (const key in meta) {
                dt.key = meta[key];
              }
              fs.writeFileSync(filename, JSON.stringify(dt));
              console.log('\u001b[32m 项目初始化完成 \u001b[0m');
            } else {
              console.log('\u001b[31m package不存在 \u001b[0m');
            }
          }
        });
      });

    } else {
      console.log('\u001b[31m 项目已存在 \u001b[0m');
    }
  });
program.parse(process.argv);
