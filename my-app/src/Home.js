import { useRef, useEffect, useState } from 'react'
import axios from 'axios';

const Home = () => {
  const [login, setLogin] = useState(false)
  const [post, setPost] = useState([]);
  let mounted = useRef()
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      axios.get('/api/getMessage')
      .then((res)=>{
        setPost(res.data)
      })
      .catch((err)=>{
        console.log(err.response.data)
      })
    }
  },[post])

  return (
    <>
      {
        post.map((item)=>{
          return (<><h1>{item.title}</h1><h1>{item.author}</h1></>)
        })
      }
    </>
  );
}

export default Home