const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Scheam = mongoose.Schema;
const scheamList = {
    'user': new Scheam({
        'userName': String,
        'password': String,
        'name': String,
        'status': Number, //0:未激活，1:已激活
        'createTime': Number,
        'updateTime': Number,
        'id': String
    })
}

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
const getModel = (name) => {
    if(scheamList[name]) {
        return mongoose.model(name, scheamList[name]);
    }
}

const User = getModel('user');
const getId = () => {
    const length = User.length;
    let id = '';
    if(length < 10) {
        return id = `tn00000${length}`
    }
    if(length < 100) {
        return id = `tn0000${length}`
    }
    return id; 
}
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
app.get('/', (req,res) => {
    res.json({
        'message': 'Welcome to ExpressJS'
    })
})
app.post('/login', (req, res) => {
    let code = 200;
    const {userName, password} = req.body;
    User.findOne({userName: userName})
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

app.get('/user',(req, res) => {
    let code = 200;
    User.find({}).then((data) => {
        returnRes(res, code, 'Success', data)
    }).catch((err) => {
        code = 500;
        returnRes(res, code, '数据库错误')
    });
})

app.delete('/deleteUser/:id', (req, res) => {
    let code = 200;
    User.deleteOne({_id: req.params.id}).then((data) => {
        returnRes(res, code, 'Success')
    }).catch((err) => {
        code = 500;
        returnRes(res, code, '数据库错误')
    });
})

app.post('/creatUser', (req, res) => {
    let code = 200;
    const {userName, password, name} = req.body;
    User.findOne({userName: userName}).then((user) => {
        if (user) {
            code = 500;
            returnRes(res, code, '用户已存在')
        } else {
            if(!userName || !password || !name) {
                code = 500;
                returnRes(res, code, '参数错误')
            } else {
                const id = getId();
                User.create({userName: userName, password: password, name: name, status: 0, createTime: Date.now(), updateTime: Date.now(), id}).then((user) => {
                    returnRes(res, code, '创建成功', user)
                }).catch((err) => {
                    code = 500;
                    returnRes(res, code, '数据库错误')
                })
            }
        }
    })
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