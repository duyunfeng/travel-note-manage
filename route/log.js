const express = require('express');
const { returnRes } = require('../utils/utils');
const { getLog } = require('../utils/log');
const router = express.Router();
router.get('/', (req, res) => {
    const query = req.query;
    const data = getLog(query.name);
    const resultArr = data.split('\n').filter(item => item.includes(` ${query.id} `))
    const length = resultArr.length; 
    if( length === 0) {
        console.log(1111)
        returnRes(res, 200, 'Success', [])
    } else {
        result = resultArr.map(item=>{
            const arr = item.split(' ');
            console.log(arr);
            return {
                time: arr[0]+ ' '+ arr[1],
                op: arr[3],
                content: arr[4],
                creater: arr[5]
            } 
        })
        returnRes(res, 200, 'Success', result.slice(length - 10)); // 只返回最新的10条记录
    }
})

module.exports = router;