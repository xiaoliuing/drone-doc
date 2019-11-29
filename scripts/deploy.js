const shell = require('shelljs');
const path = require('path');
const Rsync = require('rsync');
const colors = require('colors');
const argv = require('yargs').argv;

const [target_server] = argv._;

const servers_url = {
  stage0001: 'root@zhujingjin:/home/www/doc'
}

if(!servers_url[target_server]) {
  shell.echo(colors.red('该目标主机不存在'));
  shell.exit(1);
}

function sayNews(message) {
  shell.exec(`curl 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e2e7031e-3691-4f98-a46d-99c4a58e5d69' \-H 'Content-Type: application/json' \-d '{"msgtype": "text","text": {"content": "${message}"}}'`);
}

// linux 正常输出为0，非零为非正常输出
// 安装依赖
console.log(colors.brightYellow('🍌 开始安装依赖....'));
sayNews('开始安装依赖');
if (shell.exec('npm i --registry=https://registry.npm.taobao.org').code !== 0) {
  shell.echo(colors.red('Error: npm i failed'));
  shell.exit(1);
}


// 构建
console.log(colors.brightYellow('🍎 开始构建项目....'));
sayNews('开始构建项目');
if (shell.exec('npm run build').code !== 0) {
  shell.echo(colors.red('Error: npm run build failed'));
  shell.exit(1);
}

// 测试
console.log(colors.brightYellow('🌰 开始测试项目....'));
sayNews('开始测试项目');
if (shell.exec('npm run test').code !== 0) {
  shell.echo(colors.red('Error: npm run test failed'));
  shell.exit(1);
}

// 部署
console.log(colors.brightYellow('🌭 开始部署项目....'));
sayNews('开始部署项目');
var rsync = Rsync.build({
  source:      path.join(__dirname, '../.vuepress/dist/'),
  destination: servers_url[target_server],
  exclude:     ['.git'],
  flags:       'avz',
  shell:       'ssh'
});

rsync.execute(function(error, code, cmd) {
  console.log(error, code, cmd);
  console.log(colors.random('🎂 项目部署成功....'));
  sayNews('项目部署完成');
});