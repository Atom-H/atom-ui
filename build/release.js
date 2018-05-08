// #!/usr/bin/env node
// var inquirer = require('inquirer');
// inquirer.prompt([{
//     type: 'list',
//     message: 'which template do you need:',
//     name: 'template',
//     choices: ['normal', 'wap', 'h5']
// }]).then(function (answers) {
//     console.log(answers)
//     done();
// })     
const shell = require("shelljs");
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
let package = require("../package.json");
/**
 * 更新package.json版本号
 * @return {String} 新版本号
 */
const updatePackage = () => {
    const version = package.version;
    const versionArray = version.split('.');
    // 版本+1
    versionArray[versionArray.length - 1] = ~~versionArray[versionArray.length - 1] + 1;
    package.version = versionArray.join('.');
    fs.writeFileSync('../package.json', JSON.stringify(package, null, 4));
    console.log('升级package.json完成! 版本: ' + package.version);
    return package.version;
}
module.exports = function() {
    // 升级packages.json中的版本号
    const version = updatePackage();

    // 切换到master分支
    console.log(chalk.black.bgGreen('git开始!\n'));
    // shell.exec('git checkout master');
    shell.exec('git add -A');
    shell.exec(`git commit -m ":zap: [build] "${version}`);
    shell.exec(`git push`);
    console.log(chalk.black.bgGreen('git同步完成!\n'));

    console.log(chalk.black.bgGreen('正在发布到npm...\n'));
    shell.exec(`npm publish`);
    console.log(chalk.black.bgGreen('发布到npm成功!\n, ver: ' + package.version));
}