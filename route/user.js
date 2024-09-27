const express = require('express');
const { getSearch, returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { getNextIdFromFile } = require('../utils/file');
const router = express.Router();

const User = getModel('user')
// 使用示例
const idFile = './userId.txt';
const getId = async () => {
    let id = getNextIdFromFile(idFile) 
    if(id < 10) {
        return id = `tn00000${id}`
    }
    if(result.length < 100) {
        return id = `tn0000${id}`
    }
    return id; 
}

// 获取用户信息
router.get('/', (req, res) => {
    let code = 200;
    const search = getSearch(req.query);
    User.find(search)
        .then((data) => {
            returnRes(res, code, 'Success', data);
        })
        .catch((err) => {
            handleDatabaseError(res, err);
        });
});

// 创建用户
router.post('/creatUser', async (req, res) => {
    let code = 200;
    const { userName, password, name, userRole } = req.body;

    if (!userName || !password || !name) {
        code = 500;
        returnRes(res, code, '参数错误');
    } else {
        const existingUserName = await User.findOne({ userName: userName });
        const existingName = await User.findOne({ name: name });

        if (existingUserName) {
            code = 500;
            returnRes(res, code, '用户已存在');
        } else if (existingName) {
            code = 500;
            returnRes(res, code, '昵称已存在');
        } else {
            const id = await getId();
            const newUser = {
                userName: userName,
                password: password,
                name: name,
                status: 0,
                createTime: Date.now(),
                updateTime: Date.now(),
                id,
                role: userRole,
                desc: ''
            };
            User.create(newUser)
                .then((user) => {
                    returnRes(res, code, '创建成功', user);
                })
                .catch((err) => {
                    handleDatabaseError(res, err);
                });
        }
    }
});

// 更新用户信息
router.put('/updateUser/:id', (req, res) => {
    let code = 200;
    const { _id, status, desc } = req.body;
    User.updateOne({ _id: req.params.id }, { status, desc })
        .then((data) => {
            returnRes(res, code, 'Success');
        })
        .catch((err) => {
            handleDatabaseError(res, err);
        });
});

// 重置密码
router.put('/resetPassword/:id', (req, res) => {
    let code = 200;
    User.updateOne({ _id: req.params.id }, { password: '123456' })
        .then((data) => {
            returnRes(res, code, 'Success');
        })
        .catch((err) => {
            handleDatabaseError(res, err);
        });
});

// 删除用户
router.delete('/deleteUser/:id', (req, res) => {
    let code = 200;
    User.deleteOne({ _id: req.params.id })
        .then((data) => {
            returnRes(res, code, 'Success');
        })
        .catch((err) => {
            handleDatabaseError(res, err);
        });
});

module.exports = router;