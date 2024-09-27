const fs = require('fs');
const globalData = require('../data/global');
const { data } = globalData;
const createFolder = (folder) => {
    if(fs.existsSync(folder)){
      console.log("---目标目录已存在");
    }else{
      fs.mkdirSync(folder);
    }
  };

  const fileControl = (directoryPath, type, fileName) => {
    const files = fs.readdirSync(directoryPath);
    const control = {
      isExit: (fileName) => files.some(item => item.split('.')[0] === fileName),
      findImage: (fileName) => files.find(item => item.split('.')[0] === fileName),
    }
    return control[type](fileName);
  }
 
const getNextIdFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const id = Number(data);
    const nextId = id + 1;
    fs.writeFileSync(filePath, nextId.toString());
    return nextId;
  } catch (error) {
    // 处理错误，比如文件不存在，权限问题等
    fs.writeFileSync(filePath, '1'); // 初始化ID
    return 1;
  }
}
module.exports = { createFolder, fileControl, getNextIdFromFile };