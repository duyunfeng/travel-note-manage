const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { data } = require('../data/global');
const router = express.Router();

const Personal = getModel('personal');
const User = getModel('user');
router.get('/getPersonal', (req, res) => {
    Personal.findOne({ _id: data.user._id })
    .then(result=> {
        console.log(result)
        if(!result) {
            Personal.create({
                name: data.user.name,
                userName: data.user.userName,
                sex: 'secret',
                id: data.user.id,
                birthday: '',
                avatar: '',
                desc: '',
                _id: data.user._id
            }).then(data=> {
                returnRes(res, 200, 'Success', data)
            }).catch(err =>{
                handleDatabaseError(res, err)
            })
        } else {
            returnRes(res, 200, 'Success', result)
        }
    })
    .catch((err) => {
        console.log(err)
        handleDatabaseError(res, err);
    });
})

router.put('/updatePersonal', (req, res) => {
    const params = req.body;
    Personal.updateOne({ _id: data.user._id }, params)
    .then(()=> {
        returnRes(res, 200, 'Success')
    })
    .catch((err) => {
        console.log(err)
        handleDatabaseError(res, err);
    });
})

module.exports = router