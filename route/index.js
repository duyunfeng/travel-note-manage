const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const loginRouter = require('./login');
const userRouter = require('./user');
const personalRouter = require('./personal');
const uploadRouter = require('./upload');
const getFileRouter = require('./getFile');
const router = {
    '/login': loginRouter,
    '/user': userRouter,
    '/personal': personalRouter,
    '/upload': uploadRouter,
    '/getFile': getFileRouter
}

// 添加 body-parser 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = router