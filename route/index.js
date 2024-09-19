const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const loginRouter = require('./login');
const userRouter = require('./user');
const personalRouter = require('./personal');
const router = {
    '/login': loginRouter,
    '/user': userRouter,
    '/personal': personalRouter
}

// 添加 body-parser 中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = router