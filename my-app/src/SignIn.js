import './App.css';
import { useRef, useEffect, useStatem, useContext } from 'react'
import { useNavigate, Navigate } from 'react-router-dom';
import { Context } from './context'
import axios from 'axios';
const SignIn = () => {
    const { login ,setLogin } = useContext(Context)
    const navigate = useNavigate()
    const submit = () => {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        if(username!=="" && password!==""){
            axios.post('/api/signin', {
                username: username,
                password: password
              })
              .then(function (res) {
               
                console.log(res.data)
                setLogin(true)
                // navigate("/")
              })
              .catch(function (error) {
                console.log("aaa")
                console.log(error)
              })
        }
    }
    const mounted = useRef()
    
    useEffect(() => {
      //加載login頁面後會去call一個需要驗證登入的API，以此確認是否已登入，若已登入跳轉回主頁面
      axios.get('/api/checkIfLogined')
        .then(function(res){
          if(res.data.login){
            setLogin(true)
          }
        })
        .catch(function(err){
          console.log('尚未登入')
        })
    })
    
    return (
        <>
          {!login ? (
            <>
              <h2>登入頁面</h2>
              <input placeholder='帳號' id='username'></input>
              <input placeholder='密碼' id='password' type='password'></input>
              <button onClick={submit}>提交</button>  
              <div class="sign-in-with-google" onClick={()=>window.open('http://localhost:5001/api/login/google', '_self')}>
                  <img src="https://i.postimg.cc/zGfschMd/google-photo.png" alt="google-photo"/>
                  Sign In With Google
              </div>      
            </>
          ) : (
            <Navigate to="/" />
          )}
        </>

        
    )
}
export default SignIn