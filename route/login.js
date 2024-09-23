const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { createToken } = require('../utils/index');
const globalData = require('../data/global');
const router = express.Router();

const User = getModel('user')
router.post('/', (req, res) => {
    let code = 200;
    const {userName, password} = req.body;
    User.findOne({userName: userName})
    .then(user => {
        const token = createToken(user.toObject());
        if(user) {
            if(user.password === password) {
                if(user.status === 1) {
                    // 登录成功
                    globalData.data.user = user;
                    globalData.data.token = token;
                    returnRes(res, code, '登录成功', user, token)
                } else {
                    code = 500;
                    returnRes(res, code, '用户未激活')
                }
            } else {
                code = 500;
                returnRes(res, code, '密码错误')
            }
        } else {
            code = 500;
            returnRes(res, code, '用户不存在')
        }
    }).catch((err) => {
        handleDatabaseError(res, err)
    });
})
module.exports = router;