const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { getNextIdFromFile } = require('../utils/file');
const { data } = require('../data/global');
const router = express.Router();

const resource = getModel('resource');
router.post('/createResource', (req, res)=> {
    const params = req.body;
    resource.findOne({ name: params.name , type: params.type }).then(
        (result) => {
            if(result) {
                returnRes(res, 400, '资源已存在')
            } else {
                console.log(data);
                params.articleId = '';
                params.createTime = new Date().getTime();
                params.updateTime = new Date().getTime();
                params.creater = data.user.userName;
                params.id = `${params.type}${getNextIdFromFile('./id.txt', 'resourcesId')}`;
                console.log(params)
                resource.create(params).then(data=> {
                    returnRes(res, 200, 'Success', data)
                }).catch(err =>{
                    handleDatabaseError(res, err)
                })
            } 
        },
        (err) => {
            console.log(err)
            handleDatabaseError(res, err)
        }
    )
})
router.get('/getResource', (req, res) => {
    const query = req.query;
    let params = {}
    for(let key in query) {
        if(query[key] !== '') {
            params[key] = query[key]
        }
    }
    resource.find(params)
    .then(result=> {
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

router.put('/updateResource', (req, res) => {
    const params = req.body;
    resource.findOneAndUpdate( {id: params.id }, params)
    .then(()=> {
        returnRes(res, 200, 'Success')
    })
    .catch((err) => {
        console.log(err)
        handleDatabaseError(res, err);
    });
})

module.exports = router