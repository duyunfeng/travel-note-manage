const path = require('path');
const fs = require('fs');
const { data } = require('../data/global');

const updataLog = (name, id, type, message) => {
  // 拼接日志文件的路径
  const logPath = path.join(__dirname, `../logs/${name}.log`);
  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, '');
  }
  const log = `${new Date().toLocaleString()} ${id} [${type}] ${message} ${data.user.userName}\n`;
  fs.appendFileSync(logPath, log);
}

const getLog = (name) => {
  const logPath = path.join(__dirname, `../logs/${name}.log`);
  return fs.readFileSync(logPath, 'utf8');
}

module.exports = { updataLog, getLog };

