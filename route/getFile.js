const express = require('express');
const path = require('path');
const globalData = require('../data/global');
const { fileControl } = require('../utils/file');
const router = express.Router();
const { data } = globalData;
router.get('/:name', (req, res) => {
    const file = fileControl('findImage', req.params.name);
    if(!file) {
      returnRes(res, 400, '文件不存在')
    }
    res.sendFile(path.join(__dirname, `../public/uploads/${data.user.userName}`, file));
  })

module.exports = router;