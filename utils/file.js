const fs = require('fs');
// const ooxml = require('ooxml');
const path = require('path');
const iconv = require('iconv-lite');
const XLSX = require('xlsx');
const nodeXlSX = require('node-xlsx');
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

const readXLSXFile = (filePath) => {
//   const pat = 'public\\static\\test.xlsx';
//   const pat1 = 'public\\static\\test1.xlsx';
//   const workbook = nodeXlSX.parse(pat);
//   const workbook1 = XLSX.readFile(pat);
//   const workbook2 = XLSX.readFile(pat1);

//   console.log(workbook1.FileRels, 'relsFile')
// // 获取工作表
// const sheetName = workbook1.SheetNames[0];
// const worksheet = workbook1.Sheets[sheetName];
// // 查找图片 ID
// const imgId = '4F84365E2476490AA47F553131ADFF80';
// // 查找图片关系
// const relsFile = workbook1.Workbook;
// const relsFile1 = workbook2.Sheets;

// const imgData = worksheet['!rels'];
//   let arr = [];
//   workbook.forEach(item => {
//     if(item.name === 'Sheet1') {
//       for(let i = 1; i< item.data.length; i++) {
//         const obj = {};
//         item.data[0].forEach((ele, key) => {
//             obj[ele] = item.data[i][key];
//           }) 
//           arr.push(obj)
//         }
//     } else {
//       return arr;
//     }
//   })
//   arr.forEach(item => {
//     for(const key in item) {
//       if(key === '图片') {
//         const match = item[key].match(/"([^"]+)"/);
//         if (match && match[1]) {
//           const imgId = match[1];
//           const imgIndex = parseInt(match[2], 10);
//           // 获取图片路径
//         const mediaDir = path.join(path.dirname(pat), 'xl', 'media');
//         // 创建媒体目录（如果不存在）
//         if (!fs.existsSync(mediaDir)) {
//           fs.mkdirSync(mediaDir, { recursive: true });
//         }
//         console.log(mediaDir)
//         const picPath = path.join(mediaDir, `${imgId}.jpg`); // 假设图片是PNG格式
//         console.log(picPath)
//         // 读取图片数据
//         const picData = fs.readFileSync(picPath);
//         console.log(picData)  
//         // 加载图片并插入
//       }
//     }
//   }
//   })
//   console.log(arr)
//   return arr;

// fs.unlink(filePath, (err) => {
//   if (err) {
//       console.error('Error deleting file:', err);
//   }

//   console.log('File processed and deleted successfully' );
// });
}
module.exports = { createFolder, fileControl, getNextIdFromFile, readXLSXFile };