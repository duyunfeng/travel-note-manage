const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { getNextIdFromFile } = require('../utils/file');
const { data } = require('../data/global');
const router = express.Router();

const resource = getModel('resource');
const article = getModel('article');
const resourceId = './resources.txt'
const articleParam = {
    'title': '',
    'content': '',
    'createTime': new Date().getTime(),
    'updateTime': new Date().getTime(),
    'id': getNextIdFromFile(resourceId),
    'desc': ''
}
router.post('/createResource', (req, res)=> {
    const params = req.body;
    console.log(params)
    resource.findOne({ name: params.name , type: params.type }).then(
        (result) => {
            if(result) {
                returnRes(res, 400, '资源已存在')
            } else {
                article.create(articleParam).then(
                    (result) => {
                        params.articleId = result._id;
                        params.createTime = result.createTime;
                        params.updateTime = result.updateTime;
                        params.creater = data.user.userName;
                        resource.create(params).then(data=> {
                            returnRes(res, 200, 'Success', data)
                        }).catch(err =>{
                            handleDatabaseError(res, err)
                        })
                    }
                )
            }
        },
        (err) => {
            console.log(err)
            handleDatabaseError(res, err)
        }
    )
})
router.get('/getResource', (req, res) => {
    const type = req.query.type;
    resource.find({ type })
    .then(result=> {
        console.log(result)
        if(!result) {
            returnRes(res, 400, '资源不存在')
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