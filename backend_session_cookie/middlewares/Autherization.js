const Redis = require('ioredis')
const redisClient = new Redis()
const AuthorizationError = require('../lib/AuthorizationError')
const cookieSignature = require('cookie-signature')
const {cookieSecret} = require('../config/cookieSecret')
module.exports = function Autherization(req,res,next){

    if(req.cookies['sid']){
        //connect.sid的值去除's:'，此字串包含sessionID以及簽名後的sessionID，中間以'.'相隔
        const signedSessionID = req.cookies['sid'].slice(2)
        //此為未簽名的原始sessionID
        const sessionID = signedSessionID.slice(0, signedSessionID.indexOf('.'))
        //將原始sessionID做一次簽名，值會等於 原始sessionID  '.'  簽名後的sessionID
        const result = cookieSignature.sign(sessionID, cookieSecret)

        if(result === signedSessionID){
            //redis裡面的key格式為 sess:原始的sessionID
            redisClient.exists(`sess:${sessionID}`).then(exists => {
                if(exists){
                    next()
                }else{
                    next(new AuthorizationError('沒有登入狀態',401))
                }
            })
        }else{
            console.log("你更改Cookie了")
            next(new AuthorizationError('非法Cookie',401))
        }
    }else{
        next(new AuthorizationError('沒有登入狀態',401))
    }
}