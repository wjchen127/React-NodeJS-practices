const mongoose = require('mongoose')
//userbyOauthSchema
const userbyOauthSchema = mongoose.Schema({
    uid:{
        type: String,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    }
})
//（參數1：欲創建的 collection 名稱 / 參數2：欲使用的 Schema）
const userbyOauthDB = module.exports = mongoose.model('userbyoauth', userbyOauthSchema)