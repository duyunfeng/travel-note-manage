const express = require('express');
const { returnRes, getModel, handleDatabaseError, getSearch, getPage } = require('../utils/utils');
const { getNextIdFromFile, fileControl } = require('../utils/file');
const { data } = require('../data/global');
const { updataLog } = require('../utils/log') ;
const router = express.Router();

const article = getModel('article');
router.post('/createArticle', (req, res)=> {
    const params = req.body;
    params.createTime = new Date().getTime();
    params.updateTime = new Date().getTime();
    params.status = 0;
    params.auditDesc = '';
    params.creater = data.user.userName;
    params.id = `article${getNextIdFromFile('./id.txt', 'articleId')}`;
    if(params.deleteImages.length) {
        params.deleteImages.map(item => {
            const path = `public/uploads/article/${data?.user?.userName}`;
            const fileName = item.replace(`http://localhost:3000/${path}`, '').slice(1);
            fileControl(path, 'deleteImage', fileName)
        })
    }
    article.create(params).then(()=> {
        updataLog('article', params.id, 'created', '新增文章')
        returnRes(res, 200, 'Success')
    }).catch(err =>{
        updataLog('article', params.id, 'created failed', '创建文章失败')
        handleDatabaseError(res, err)
    })
} 
        
    
)

router.put('/auditArticle/:id', (req, res)=> {
    const {  status, auditDesc } = req.body;
    const params = req.params;
    article.updateOne({ id: params.id }, { status, auditDesc }).then(()=> {
        updataLog('article', params.id, 'audited', '审核文章')
        returnRes(res, 200, 'Success')
    }).catch(err =>{
        updataLog('article', req.params.id, 'audit failed', '审核失败')
        handleDatabaseError(res, err)
    })
} 
        
    
)

router.put('/updateArticle', (req, res) => {
    const params = req.body;
    article.findOneAndUpdate( {id: params.id }, params)
    .then(()=> {
        updataLog('article', params.id, 'updated', '更新完成')
        returnRes(res, 200, 'Success')
    })
    .catch((err) => {
        updataLog('article', params.id, 'update failed', '更新失败')
        handleDatabaseError(res, err);
    });
})

router.get('/getArticle', (req, res) => {
    const query = req.query;
    let params = getSearch(query)
    article.find(params)
    .then(result=> {
        if(!result) {
            returnRes(res, 400, '文章不存在')
        } else {
            result = result.filter(item => (item.creater === data.user.userName && item.status === 3) || item.status !== 3);
            const dataResult = {...getPage(query.page, query.pageSize, result)}
            returnRes(res, 200, 'Success', dataResult)
        }
    })
    .catch((err) => {
        handleDatabaseError(res, err);
    });
})

router.delete('/deleteArticle/:id', (req, res) => {
    const params = req.params;
    article.findOneAndDelete({id: params.id})
    .then(()=> {
        updataLog('article', params.id, 'deleted', '删除成功')
        returnRes(res, 200, 'Success')
    }).catch((err) => {
        updataLog('article', params.id, 'delete failed', '删除失败')
        handleDatabaseError(res, err);
    });
})

module.exports = router