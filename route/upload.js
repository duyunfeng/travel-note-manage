
const express = require('express');
const multer = require('multer');
const iconv = require('iconv-lite');
const fs = require('fs');
const { returnRes, getModel } = require('../utils/utils');
const globalData = require('../data/global');
const router = express.Router();
const { data } = globalData;
const { fileControl, createFolder, readXLSXFile  } = require('../utils/file');
const personal = getModel('personal')
const resource = getModel('resource')
// 设置存储配置
const storage = (url) => {
  const options = {
    '/':  'public/uploads/avatar',
    '/resource': `public/uploads/resource`,
    '/mulResource': `public/static`,
  }
  let urlResult = options[url];
  return multer.diskStorage({
    destination: function (req, file, cb) {
      if(url === '/') {
        urlResult = options[url] + `/${data?.user?.userName}`;
      }
      createFolder(urlResult);
      cb(null, urlResult) // 确保这个文件夹已经存在
    },
    filename: function (req, file, cb) {
      if(url === '/') {
        urlResult = options[url] + `/${data?.user?.userName}`;
      }
      const name =iconv.decode(file.originalname.split('.')[0], 'utf-8');
      console.log(name)
      const ext = file.originalname.split('.')[1];
      if(fileControl(urlResult, 'isExit', name)) {
        // 文件名重复
        returnRes(req.res, 400, `文件名已存在: ${name}`);
        cb(new Error('文件名已存在'), null);
      }
      cb(null, `${name}.${ext}`)
    }
  })
}
 
const getUpload = (url) => {
  return multer({ storage: storage(url)})
}
const upload = getUpload('/');
const uploadResource = getUpload('/resource');
const uploadFile = getUpload('/mulResource')
// upload.single('image'), 
// 上传单个文件
router.post('/', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    returnRes(res, 400, '没有文件上传');
  }
  const fileName = fileControl(`public/uploads/avatar/${data?.user?.userName}`, 'findImage', file.originalname.split('.')[0]);
  const filePath = `/public/uploads/avatar/${data?.user?.userName}/${fileName}`;
  personal.findByIdAndUpdate(data.user._id, { avatar: filePath }, { new: true })
  .then((result) => {
    console.log(result);
    returnRes(res, 200, '上传成功', result);
  }).catch(err => {
    console.log(err);
  })
});
router.post('/resource', uploadResource.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    returnRes(res, 400, '没有文件上传');
  }
  const fileName = fileControl('public/uploads/resource', 'findImage', iconv.decode(file.originalname.split('.')[0], 'utf-8'));
  const filePath = `/public/uploads/resource/${fileName}`;
  returnRes(res, 200, '上传成功', filePath);
});

router.post('/mulResource', uploadFile.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    returnRes(res, 400, '没有文件上传');
  }
  console.log(file.path)
  const data = readXLSXFile(file.path);
  console.log(data)
  fs.unlink(file.path, (err) => {
    if (err) {
        console.error('Error deleting file:', err);
    }

    console.log('File processed and deleted successfully' );
});
  // storeData(data);
  returnRes(res, 200, '上传成功');
  // returnRes(res, 200, '上传成功', file.path);
} )

const storeData = (data) => {
  console.log("存储的数据：", data);
  // 这里可以将数据存储到数据库中
  resource.create(data).then(result => {
    console.log("存储成功：", result);
  }).catch(err => {
    console.log("存储失败：", err);
  })
}

module.exports = router;