const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const router = express.Router();

const User = getModel('user')
router.post('/', (req, res) => {
    let code = 200;
    const {userName, password} = req.body;
    User.findOne({userName: userName})
    .then(user => {
        if(user) {
            if(user.password === password) {
                if(user.status === 1) {
                    // 登录成功
                    returnRes(res, code, '登录成功', user)
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