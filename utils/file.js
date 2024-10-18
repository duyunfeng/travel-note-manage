const fs = require('fs');
// const ooxml = require('ooxml');
const path = require('path');
const iconv = require('iconv-lite');
const ExcelJS = require('exceljs');
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
    console.log(files)
    const control = {
      isExit: (fileName) => files.some(item => item.split('.')[0] === fileName),
      findImage: (fileName) => files.find(item => item.split('.')[0] === fileName),
      deleteImage: (fileName) => {
        const filePath = path.join(directoryPath, fileName);
        fs.unlinkSync(filePath);
      }
    }
    console.log(type, fileName)
    return control[type](fileName);
  }
 
const getNextIdFromFile = (filePath, fileName) => {
  let nextId;
  const data = fs.readFileSync(filePath, 'utf8');
  try {
    const arr = data.split('\r\n');
    const newArr = arr.map(item => {
      const itemArr = item.split(' ')
      const name = itemArr[0];
      if(name === fileName) {
        const id = Number(itemArr[1]);
        nextId = id + 1;
        itemArr[1] = String(nextId);
      }
      return itemArr.join(' ');
    })
    const newData = newArr.join('\r\n');
    fs.writeFileSync(filePath, newData);
    return nextId;
  } catch (error) {
    // 处理错误，比如文件不存在，权限问题等
    fs.writeFileSync(filePath, '1'); // 初始化ID
    return 1;
  }
}

const readXLSXFile = async (filePath) => {
  const pat = 'public\\static\\test.xlsx';
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(pat)
  const worksheet = workbook.getWorksheet(1);
  console.log(worksheet.getImages())
  const images = workbook.media.map(item => {
    const image = Buffer.from(item.buffer);
    const path = 'public\\static\\' + item.name + '.' + item.extension;
    // fs.writeFile(path, image, err => {
    //   console.log(err)
    // })
    // console.log(image)
  })
}
// readXLSXFile('')
module.exports = { createFolder, fileControl, getNextIdFromFile, readXLSXFile };