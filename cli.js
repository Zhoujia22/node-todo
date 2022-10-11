#!/usr/bin/env node
const program = require('commander');
const api = require('./index');
program
    .option('-x, --xxx', 'what the x');
program
    .command('add')
    .description('add a task')
    .action((...args) => {
        const word = args.slice(0, -1).join(' ');
        api.add(word).then(() => {console.log('添加成功');}, () => {console.log('添加失败');});
    });
program
    .command('clear')
    .description('clear all task')
    .action(() => {
        api.clear().then(() => {console.log('清除成功');}, () => {console.log('清除失败');});
    });
program.parse(process.argv);

if (process.argv.length === 2) {
    void api.showAll();
}