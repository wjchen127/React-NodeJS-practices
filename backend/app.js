const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const { checkPassWordValidation } = require('./middlewares/checkPassWordValidation')
const ValidationError = require('./lib/ValidationError')
const AuthorizationError = require('./lib/AuthorizationError')
const jwt = require('jsonwebtoken')
const {SECRET} = require('./config/authSecret')
const Authentication = require('./lib/Authentication')
const app = express()

// create application/json parser
const jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser); // <--- Here
app.use(urlencodedParser);

//帶入MongoDB的Model
let Article = require('./models/article')
let userDB = require('./models/user')
const e = require('express')

//建立MongoDB連線
mongoose.connect('mongodb://localhost/app')
const db = mongoose.connection;

//檢查MongoDB連線
db.once('open', ()=>{
  console.log('Connected to MongoDB')
})
//檢查DB連線錯誤
db.on('error', ()=>{
  console.log(err)
})



app.post('/api/signin', (req, res, next) => {
  const {username, password} = req.body
  //查詢DB
  userDB.findOne({username:username}, (err,obj)=>{
    if(err) next(err)
    if(obj){
      //比對加密的密碼與輸入的密碼是否一致
      const psres = bcrypt.compareSync(password,obj.password)

      if(psres){
        //JWT的payload
        const payload = {
          id:obj._id,
          username:obj.username
        }
        //生成一個JWT
        const token = jwt.sign(payload, SECRET, {expiresIn:'1m'})
        res.json({msg:'SignIn is Successful.',token:token})

      }else{
        next(new ValidationError("密碼錯誤",401))
      }
    }else{
      next(new ValidationError("帳號不存在",401))
    }
    
  })
})

app.post('/api/signup', checkPassWordValidation, (req, res, next) => {
  const {username, password, repassword} = req.body
  //檢查帳號是否重複
  userDB.find({username:username}, (err,obj)=>{
    if(err) next(err)
    if(obj.length===0){

      //將密碼加密，後傳入資料庫
      cryptpassword = bcrypt.hashSync(password, 10)

      const insertData = new userDB({username:username,password:cryptpassword})
      insertData.save()
      .then(result=>{
        res.send("註冊成功")
      })
    }else{
      next(new ValidationError("帳號已存在，請重新想一個",401))
    }
  })
})


//JWT認證，此之後的api都為授權操作
app.use(Authentication)

app.get('/api/getMessage', (req, res) => {

  Article.find({}, (err, obj)=>{
    if(err){
      console.log(err)
    }else{
      res.json(obj)
    }
  })  
})

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError || err instanceof AuthorizationError)
    return res.status(err.status).send(err.message)
  return res.status(500).send(err.stack);
});

app.listen(5001, function () {
  console.log('Example app listening on port 5001!')
})