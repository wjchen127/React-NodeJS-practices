import './App.css';
import Home from './Home';
import SignIn from './SignIn';
import SignUp from './SignUp';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Context } from './context';
import { useState, createContext } from 'react'
function App() {

  const [login, setLogin] = useState(false);

  return (
    <Context.Provider 
      value={{
      login,
      setLogin,
    }}>
      <Routes>
        <Route index element={<Home/>} />
        <Route path="signin" element={<SignIn/>} />
        <Route path="signup" element={<SignUp/>} />
      </Routes>
    </Context.Provider>
  );
}

export default App;
