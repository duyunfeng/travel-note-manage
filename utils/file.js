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

  module.exports = { createFolder, fileControl };