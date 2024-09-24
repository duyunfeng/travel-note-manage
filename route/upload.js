
const express = require('express');
const multer = require('multer');
const path = require('path');
const { returnRes, getModel } = require('../utils/utils');
const globalData = require('../data/global');
const router = express.Router();
const { data } = globalData;
const { fileControl, createFolder } = require('../utils/file');
const personal = getModel('personal')
// 设置存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    createFolder(`public/uploads/avatar/${data?.user?.userName}`);
    cb(null, `public/uploads/avatar/${data?.user?.userName}`) // 确保这个文件夹已经存在
  },
  filename: function (req, file, cb) {
    const name = file.originalname.split('.')[0];
    const ext = file.originalname.split('.')[1];
    if(fileControl(`public/uploads/avatar/${data?.user?.userName}`, 'isExit', name)) {
      // 文件名重复
      returnRes(req.res, 400, `文件名已存在: ${name}`);
      cb(new Error('文件名已存在'), null);
    }
    cb(null, `${name}.${ext}`)
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
  const fileName = fileControl(`public/uploads/avatar/${data?.user?.userName}`, 'findImage', file.originalname.split('.')[0]);
  const filePath = `/avatar/${data?.user?.userName}/${fileName}`;
  personal.findByIdAndUpdate(data.user._id, { avatar: filePath })
  .then((result) => {
    console.log(res);
    returnRes(res, 200, '上传成功', result);
  }).catch(err => {
    console.log(err);
  })
});

module.exports = router;