
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
 
// 创建目标目录
const createFolder = function(folder){
  if(fs.existsSync(folder)){
    console.log("---目标目录已存在");
  }else{
    fs.mkdirSync(folder);
  }
};

// 设置存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    // createFolder(`uploads/${}`);
    cb(null, 'uploads/') // 确保这个文件夹已经存在
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const upload = multer({ storage: storage });
// upload.single('image'), 
// 上传单个文件
router.post('/', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully.');
});

module.exports = router;