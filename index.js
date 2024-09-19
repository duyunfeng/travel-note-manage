const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT"); // 允许的方法
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.options('*', (req, res) => {
    res.sendStatus(204);
});
const router = require('./route/index')

// 注册合并后的路由器
for(let path in router) {
    app.use(path, router[path]);
}

// 日志输出成功信息
console.log('Routers loaded successfully.');
mongoose.connect('mongodb://localhost:27017/myDataBase')
.then(() => {
    app.listen(3000,() => {
        console.log('Server is running on port 3000');
    });
    console.log('Connected to MongoDB');
}).catch(err => {
    cachesonsole.log('Error connecting to MongoDB', err);
});