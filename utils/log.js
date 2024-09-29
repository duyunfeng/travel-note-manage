const {getModel} = require('./utils');
const {getNextIdFromFile} = require('./file')
const {data} = require('../data/global')
const Log = getModel('log');
const updata = (params) => {
    Log.find({type: params.type}).then(result => {
        if(result.length === 0) {
            Log.create({
                type: params.type,
                content: '创建成功',
                time: Date.now(),
                op: 'create',
                id: '1',
                creater: data.user.userName
            })
        }
    }) 
}