const db = require('./db');
const inquirer = require('inquirer');

module.exports.add = async (title) => {
    const list = await db.read();
    list.push({title, done: false});
    await db.write(list);
};
module.exports.clear = async () => {
    await db.write([]);
};

function askForCreateTasks(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入你想起的新名字'
    }).then((answers) => {
        list.push({title: answers.title, done: false});
        db.write(list);
    });
}

function askForAction(list, index) {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '你又要做啥',
        choices: [
            {name: '退出', value: 'quit'},
            {name: '已完成', value: 'markAsDone'},
            {name: '未完成', value: 'markAsUndone'},
            {name: '改标题', value: 'upDateTitle'},
            {name: '删除', value: 'remove'}
        ]
    }).then((answers2) => {
        switch (answers2.action) {
            case 'quit':
                break;
            case 'markAsDone':
                list[index].done = true;
                db.write(list);
                break;
            case 'markAsUndone':
                list[index].done = false;
                db.write(list);
                break;
            case 'upDateTitle':
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '输入你想起的新名字'
                }).then((answers) => {
                    list[index].title = answers.title;
                    db.write(list);
                });
                break;
            case 'remove':
                list.splice(index, 1);
                db.write(list);
                break;
        }
    });
}

function printTask(list) {
    inquirer.prompt(
        {
            type: 'list',
            name: 'index',
            message: '你想做啥?',
            choices: [{name: '退出', value: '-1'},
                ...list.map((task, index) => {
                    return {name: `${task.done ? '[x]' : '[_]'}${index + 1} - ${task.title}`, value: index.toString()};
                }), {name: '+ 创建任务', value: '-2'}]
        }
    ).then(function (answers) {
        const index = parseInt(answers.index);
        if (index >= 0) {
            askForAction(list, index);
        } else if (answers.index === '-2') {
            askForCreateTasks(list);
        }
    });
}

module.exports.showAll = async () => {
    const list = await db.read();
    printTask(list);
};