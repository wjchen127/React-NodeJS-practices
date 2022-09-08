const ValidationError = require('../lib/ValidationError')
const { body, validationResult} = require("express-validator")

exports.checkPassWordValidation = [
    body('username')
    .trim()
    .isLength({min:5})
    .withMessage("USERNAME_INVALID"),
    body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage("PASSWORD_INVALID"),
    body("repassword")
      .trim(),
    (req,res,next) => {
        if(req.body.password!==req.body.repassword){
            next(new ValidationError("密碼兩次不匹配",400))
        }
        const validationResults = validationResult(req)
        if(validationResults.errors?.length > 0){
            next(new ValidationError("帳號密碼格式錯誤",400))
        }
        next()
    }
]