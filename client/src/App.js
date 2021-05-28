import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import "./App.css";


function App() {

  const [usernameReg, setUsernameReg] = useState('');
  const [passwordReg, setPasswordReg] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [logoutStatus, setLogoutStatus] = useState("");

  Axios.defaults.withCredentials = true;

  const register = () => {
    Axios.post("http://localhost:3001/register", {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      if (response.data.message) {
        setRegStatus(response.data.message);
      }
      console.log(response);
    });
  };

  const login = () => {
    Axios.post("http://localhost:3001/login", {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      }
      else{
        setLoginStatus(response.data[0].username);
      }
      console.log(response.data);
    });
  };

  const logout = () => {
    Axios.post("http://localhost:3001/logout", {
      username: username,
      password: password,
  }).then((response) => {
     setLogoutStatus(response.data.message);
  })
   
  }

  useEffect(()=> {
    Axios.get("http://localhost:3001/login").then((response) => {
      if(response.data.loggedIn === true){
      setLoginStatus(response.data.user[0].username);
      }
    })
  },[])

  return(
  <div className="App">
    <div className="registration">
      <h1>Register</h1>
      <label>Username</label> 
      <input type="text" onChange={
        (e)=> {setUsernameReg(e.target.value);
      }} />
      <label>Password</label>
      <input type="text" onChange={
        (e)=> {setPasswordReg(e.target.value);
      }} />
      <button onClick={register}>Register</button>
      <h2>{regStatus}</h2>
    </div>
    <div className="login">
      <h1>login</h1>
      <label>Username</label> 
      <input type="text" onChange={
        (e)=> {setUsername(e.target.value);
      }} />
      <label>Password</label>
      <input type="text" onChange={
        (e)=> {setPassword(e.target.value);
      }} />
      <button onClick={login}>Login</button>
      <h2>{loginStatus}</h2>
    </div>
    <div className={login}>
      <button onClick={logout}>logout</button>
      <h2>{logoutStatus}</h2>
    </div>
  </div>
  );
}

export default App;