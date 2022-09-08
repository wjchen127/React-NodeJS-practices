const {SECRET} = require('../config/authSecret')
const jwt = require('jsonwebtoken')
const AuthorizationError = require('./AuthorizationError')

const Authentication = (req,res,next) => {

    let token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
          next(new AuthorizationError('無授權進行此操作！',401))
        } else {
          next()
        }
      })
}
module.exports = Authentication

