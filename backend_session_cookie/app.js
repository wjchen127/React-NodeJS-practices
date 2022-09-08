const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const session = require('express-session')
const cookieParser = require('cookie-parser')
const Redis = require('ioredis')
const redisClient = new Redis()
const RedisStore = require('connect-redis')(session)
const { checkPassWordValidation } = require('./middlewares/checkPassWordValidation')
const ValidationError = require('./lib/ValidationError')
const Autherization = require('./middlewares/Autherization')
const {cookieSecret} = require('./config/cookieSecret')
const app = express()

// create application/json parser
const jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser); // <--- Here
app.use(urlencodedParser);
app.use(cookieParser())

//使用session
app.use(session({
	secret: cookieSecret,
  name: "sid",
	resave: true,
	saveUninitialized: false,
	cookie: { maxAge: 600 * 1000 },
	store: new RedisStore({client:redisClient})
}))

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
        req.session.login = true
        req.session.username = username
        res.send('成功登入！')

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

app.use(Autherization)

app.get('/api/checkIfLogined', (req, res) => {
  res.json({login:true})
})
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
  if (err instanceof ValidationError)
    return res.status(err.status).send(err.message)
  return res.status(500).send(err.stack);
});

app.listen(5001, function () {
  console.log('Example app listening on port 5001!')
})