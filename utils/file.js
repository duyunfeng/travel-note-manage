const fs = require('fs');
const iconv = require('iconv-lite');
const XLSX = require('xlsx');
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
const readXLSXFile = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetNameList = workbook.SheetNames;
  const data = [];

  // 遍历每个工作表
  for (let i = 0; i < sheetNameList.length; i++) {
    const worksheet = workbook.Sheets[sheetNameList[i]];
    const sheetData = XLSX.utils.sheet_to_json(worksheet);
    console.log(sheetData)
    const result = sheetData.map(item => {
      console.log(item)
      const params = {};
      for(let key in item) {
        console.log(key)
        params[iconv.decode(key, 'GB2312')] = iconv.decode(item[key], 'GB2312');
      }
      return params;
    });
    console.log(result)
    

    // 将每个工作表的数据添加到data数组中
    data.push(...result);
  }

  return data;
}

module.exports = { createFolder, fileControl, getNextIdFromFile, readXLSXFile };