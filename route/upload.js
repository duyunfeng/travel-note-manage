
const express = require('express');
const multer = require('multer');
const path = require('path');
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
    '/articlesImage': 'public/uploads/article'
  }
  let urlResult = options[url];
  return multer.diskStorage({
    destination: function (req, file, cb) {
      if(['/', '/articlesImage'].includes(url)) {
        urlResult = options[url] + `/${data?.user?.userName}`;
      }
      createFolder(urlResult);
      cb(null, urlResult) // 确保这个文件夹已经存在
    },
    filename: function (req, file, cb) {
      if(['/', '/articlesImage'].includes(url)) {
        urlResult = options[url] + `/${data?.user?.userName}`;
      }
      const name =iconv.decode(file.originalname.split('.')[0], 'utf-8');
      const ext = file.originalname.split('.')[1];
      if(url === '/articlesImage') {
        cb(null, `${name}-${new Date().getTime()}.${ext}`)
      } else {
        if(fileControl(urlResult, 'isExit', name)) {
          // 文件名重复
          returnRes(req.res, 400, `文件名已存在: ${name}`);
          cb(new Error('文件名已存在'), null);
        }
        cb(null, `${name}.${ext}`)
      }
    }
  })
}
 
const getUpload = (url) => {
  return multer({ storage: storage(url)})
}
const upload = getUpload('/');
const uploadResource = getUpload('/resource');
const uploadFile = getUpload('/mulResource')
const uploadArticlesImage = getUpload('/articlesImage');
// upload.single('image'), 
// 上传单个文件
router.post('/', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    returnRes(res, 400, '没有文件上传');
  }
  const fileName = fileControl(`public/uploads/avatar/${data?.user?.userName}`, 'findImage', iconv.decode(file.originalname.split('.')[0], 'utf-8'));
  const filePath = `/public/uploads/avatar/${data?.user?.userName}/${fileName}`;
  personal.findByIdAndUpdate(data.user._id, { avatar: filePath }, { new: true })
  .then((result) => {
    returnRes(res, 200, '上传成功', result);
  }).catch(err => {
  })
});
router.post('/articlesImage', uploadArticlesImage.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    returnRes(res, 400, '没有文件上传');
  }
  const filePath = `/public/uploads/article/${data?.user?.userName}/${file.filename}`;
  const result = {
    "errno": 0, // 注意：值是数字，不能是字符串
    "data": {
      "url": filePath, // 图片 src ，必须
      "alt": "yyy", // 图片描述文字，非必须
      "href": "zzz" // 图片的链接，非必须
    }
  }
  returnRes(res, 200, '上传成功', result);
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
  const data = readXLSXFile(file.path);
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