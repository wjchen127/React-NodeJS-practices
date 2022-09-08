const mongoose = require('mongoose')

//Article Schema
const articleSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    author:{
        type: String,
        require: true
    },
    body:{
        type: String,
        require: true
    }
})

//（參數1：欲創建的 collection 名稱 / 參數2：欲使用的 Schema）
const Article = module.exports = mongoose.model('Articles', articleSchema)