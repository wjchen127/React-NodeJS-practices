import { useRef, useEffect, useState } from 'react'
import axios from 'axios';

const SignUp = () => {

    const submit = () => {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const repassword = document.getElementById('repassword').value
        if(username !== "" && password !== "" && password === repassword){
            axios.post('/api/signup',
            {
                username:username,
                password:password,
                repassword:repassword               
            })
            .then((res)=>{
                console.log(res.data)             
            })
            .catch((err)=>{
                console.log(err.response.data)
            })
        }

    }

    return (
        <>
            <h2>註冊</h2>
            <input placeholder='帳號' id="username"></input>
            <input placeholder='密碼' id="password" type="password"></input>
            <input placeholder='再輸入一次密碼' id="repassword" type="password"></input>
            <button onClick={submit}>註冊</button>
        </>
    )
}

export default SignUp