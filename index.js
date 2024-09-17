const express = require('express');
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const Scheam = mongoose.Schema;
const scheamList = {
    'user': new Scheam({
        'username': String,
        'password': String
    })
}
const getModel = (name) => {
    if(scheamList[name]) {
        return mongoose.model(name, scheamList[name]);
    }
}
mongoose.connect('mongodb://localhost:27017/myDataBase')
.then(() => {

    console.log('Connected to MongoDB');
}).catch(err => {
    cachesonsole.log('Error connecting to MongoDB', err);
});

mongoose.connection.once('open', async () => {
    const User = getModel('user');
    const user = await User.findOne({username: 'admin'});
    console.log(user)
    if(!user) {
        User.create({username: 'admin', password: '123456'}).then(async res => {
            const user = await User.findOne({username: 'admin'});
            console.log(user)
        })
    } 
})