const express = require('express');
const { getSearch, returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const router = express.Router();

const Personal = getModel('personal')
router.get('/getPersonal', (req, res) => {
    console.log(1111)
    const { id } = req.query;
    Personal.findOne({ id })
    .then(data=> {
        returnRes(res, 200, 'Success', data)
    }, (err) => {
        handleDatabaseError(res, err)
    })
    .catch((err) => {
        console.log(err)
        handleDatabaseError(res, err);
    });
})

module.exports = router