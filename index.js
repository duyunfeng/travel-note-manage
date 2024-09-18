const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Scheam = mongoose.Schema;
const scheamList = {
    'user': new Scheam({
        'username': String,
        'password': String
    })
}

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST"); // 允许的方法
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const getModel = (name) => {
    if(scheamList[name]) {
        return mongoose.model(name, scheamList[name]);
    }
}
app.get('/', (req,res) => {
    res.json({
        'message': 'Welcome to ExpressJS'
    })
})

app.options('*', (req, res) => {
    res.sendStatus(204);
});

const returnRes = (res, code, message, data) => {
    resData = {
        code,
        message,
    }
    if(data) {
        resData.data = data;
    }
    res.status(code).json(resData);
}
app.post('/login', (req, res) => {
    let code = 200;
    const User = getModel('user');
    const {username, password} = req.body;
    User.findOne({username: username})
    .then(user => {
        if(user) {
            if(user.password === password) {
                returnRes(res, code, '登录成功', user)
            } else {
                code = 500;
                returnRes(res, code, '密码错误')
            }
        } else {
            code = 500;
            returnRes(res, code, '用户不存在')
        }
    }).catch((err) => {
        code = 500;
        returnRes(res, code, '数据库错误')
    });
})
mongoose.connect('mongodb://localhost:27017/myDataBase')
.then(() => {
    app.listen(3000,() => {
        console.log('Server is running on port 3000');
    });
    console.log('Connected to MongoDB');
}).catch(err => {
    cachesonsole.log('Error connecting to MongoDB', err);
});