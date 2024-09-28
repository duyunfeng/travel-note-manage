const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const { authMiddleware } = require('./utils/index');
const app = express();
app.use(bodyParser.json());
// 设置静态文件目录
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8081");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT"); // 允许的方法
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});


app.options("*", (req, res) => {
  res.sendStatus(204);
});

const router = require("./route/index");

// 注册合并后的路由器
for (let path in router) {
  if(['/login', '/getFile'].includes(path)) {
    app.use(`/api${path}`, router[path]);
  } else {
    app.use(`/api${path}`, authMiddleware, router[path]);
  }
}

// 日志输出成功信息
console.log("Routers loaded successfully.");
mongoose
  .connect("mongodb://localhost:27017/myDataBase")
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Server is running on port 3000");
    });
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });
