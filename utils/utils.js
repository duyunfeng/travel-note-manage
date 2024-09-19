const mongoose = require('mongoose');
const scheamList = require('../model/scheam')
const getModel = (name) => {
    if(scheamList[name]) {
        return mongoose.model(name, scheamList[name]);
    }
}

const getSearch = (query) => {
    const search = {};
    const someQuery = ['userName', 'name', 'id'];
    for(let key in query) {
        if(query[key]) {
            if(someQuery.includes(key)) {
                search[key] = new RegExp(query[key], 'i');
            } else {
                search[key] = query[key]; 
            }
        }
    }
    return search;
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

const handleDatabaseError = (res, err) => {
    console.error('Database error:', err);
    returnRes(res, 500, '数据库错误');
}

module.exports = { getModel, getSearch, returnRes, handleDatabaseError }