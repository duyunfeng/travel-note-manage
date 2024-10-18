const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { data } = require('../data/global');
const router = express.Router();

const Personal = getModel('personal');
router.get('/getPersonal', (req, res) => {
    const params = req.query;
    Personal.findOne(params)
    .then(result=> {
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
            }).then(result=> {
                returnRes(res, 200, 'Success', {result:result})
            }).catch(err =>{
                handleDatabaseError(res, err)
            })
        } else {
            returnRes(res, 200, 'Success', {result:result})
        }
    })
    .catch((err) => {
        handleDatabaseError(res, err);
    });
})

router.put('/updatePersonal', (req, res) => {
    const params = req.body;
    Personal.updateOne({ id: data.user.id }, params)
    .then(()=> {
        returnRes(res, 200, 'Success')
    })
    .catch((err) => {
        handleDatabaseError(res, err);
    });
})

module.exports = router