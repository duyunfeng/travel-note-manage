const mongoose = require('mongoose');
const Scheam = mongoose.Schema;
const scheamList = {
    'user': new Scheam({
        'userName': String,
        'password': String,
        'name': String,
        'status': Number, //0:未激活，1:已激活
        'role': String, //user, operator, admin
        'createTime': Number,
        'updateTime': Number,
        'id': String,
        'desc': String
    }),
    'personal': new Scheam({
        'name': String,
        'userName': String,
        'sex': String,
        'id': String,
        'birthday': String,
        'avatar': String,
        'desc': String
    })
}

module.exports = scheamList;