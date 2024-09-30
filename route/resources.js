const express = require('express');
const { returnRes, getModel, handleDatabaseError } = require('../utils/utils');
const { getNextIdFromFile } = require('../utils/file');
const { data } = require('../data/global');
const { updataLog } = require('../utils/log') ;
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
                params.id = `${params.type}${getNextIdFromFile('./id.txt', `${params.type}Id`)}`;
                console.log(params)
                resource.create(params).then(data=> {
                    updataLog('resource', params.id, 'created', '新增资源')
                    returnRes(res, 200, 'Success', data)
                }).catch(err =>{
                    updataLog('resource', params.id, 'created failed', '创建资源失败')
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
    console.log(params, '更新资源')
    resource.findOneAndUpdate( {id: params.id }, params)
    .then(()=> {
        updataLog('resource', params.id, 'updated', '更新完成')
        returnRes(res, 200, 'Success')
    })
    .catch((err) => {
        console.log(err)
        updataLog('resource', params.id, 'update failed', '更新失败')
        handleDatabaseError(res, err);
    });
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

router.delete('/deleteResource', (req, res) => {
    const params = req.body;
    resource.findOneAndDelete({id: params.id})
    .then(()=> {
        updataLog('resource', params.id, 'deleted', '删除成功')
        returnRes(res)
    }).catch((err) => {
        console.log(err)
        updataLog('resource', params.id, 'delete failed', '删除失败')
        handleDatabaseError(res, err);
    });
})

module.exports = router