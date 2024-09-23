
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { returnRes } = require('../utils/utils');
const globalData = require('../data/global');
const router = express.Router();
const { data } = globalData;
// 创建目标目录
const createFolder = function(folder){
  if(fs.existsSync(folder)){
    console.log("---目标目录已存在");
  }else{
    fs.mkdirSync(folder);
  }
};

const fileIsExist = function(fileName){
  const directoryPath = `uploads/${data.user.userName}`;
  const files = fs.readdirSync(directoryPath);
  return files.some(item => item.split('-')[0] === fileName);
}

// 设置存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    createFolder(`uploads/${data.user.userName}`);
    cb(null, `uploads/${data.user.userName}`) // 确保这个文件夹已经存在
  },
  filename: function (req, file, cb) {
    if(fileIsExist(file.fieldname)) {
      // 文件名重复
      returnRes(req.res, 400, `文件名已存在: ${file.fieldname}`);
      cb(new Error(`文件名已存在: ${filePath}`), null);
    }
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const upload = multer({ storage: storage });
// upload.single('image'), 
// 上传单个文件
router.post('/', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    returnRes(res, 400, '没有文件上传');
  }
  returnRes(res, 200, '上传成功');
});

module.exports = router;