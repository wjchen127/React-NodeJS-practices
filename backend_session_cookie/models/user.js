const mongoose = require('mongoose')
//User Schema
const userSchema = mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
})

//（參數1：欲創建的 collection 名稱 / 參數2：欲使用的 Schema）
const userDB = module.exports = mongoose.model('user', userSchema)