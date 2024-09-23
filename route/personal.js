const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');

const router = express.Router();

const Personal = getModel('personal');
const User = getModel('user');
router.get('/getPersonal', (req, res) => {
    const { id } = req.query;
    if(!id) {
        returnRes(res, 400, '参数错误');
        return;
    }
    Personal.findOne({ _id: id })
    .then(data=> {
        if(!data) {
            User.findOne({ _id: id })
            .then(data=> {
                Personal.create({
                    name: data.name,
                    userName: data.userName,
                    sex: 'secret',
                    id: data.id,
                    birthday: '',
                    avatar: '',
                    desc: ''
                }).then(data=> {
                    returnRes(res, 200, 'Success', data)
                })    
            }, (err) => {
                handleDatabaseError(res, err)
            })
        } else {
            returnRes(res, 200, 'Success', data)
        }
    }, (err) => {
        handleDatabaseError(res, err)
    })
    .catch((err) => {
        console.log(err)
        handleDatabaseError(res, err);
    });
})

module.exports = router