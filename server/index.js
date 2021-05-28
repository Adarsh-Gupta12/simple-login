const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const bcrypt = require('bcrypt');
const saltrounds = 10

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  key: "userId",
  secret: "subscribe",
  resave: false,
  saveUninitialized: false,
  cookie: { 
    expires: 60*60*24,
  }
}))

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "mypass",
  database: "LoginSystem",
});

app.post('/register', (req,res)=> {

  const username = req.body.username;
  const password = req.body.password;
  

  if(username.length>0 && password.length>0){
    bcrypt.hash(password,saltrounds, (err, hash)=>{
      if(err){
        console.log(err);
      }

      db.query("INSERT INTO users (username,password) values (?,?)", [username,hash],
      (err,result)=>{
        console.log(err);
  } 
  )
    });
  }
  if(username.length==0){
    res.send({ message: "Username can't be null"});
  }
  else if(password.length==0){
    res.send({ message: "Password can't be null"})
  }
});


app.get("/login", (req,res)=> {
  if(req.session.user) {
    res.send({loggedIn: true, user: req.session.user})
  } else{
    res.send({loggedIn: false})
  }
})


app.post('/login',(req,res)=> {

  const username = req.body.username;
  const password = req.body.password;
  db.query("SELECT * FROM users WHERE username =?", username,
  (err,result)=>{
    if(err){
      res.send({err: err});
    }
    
    if(result.length>0) {
      bcrypt.compare(password, result[0].password, (error,response)=>{
        if(response) {
          req.session.user = result;
          console.log(req.session.user);
          res.send(result);
        }
        else{
          res.send({ message: "wrong username and password combination"})
        }
      })
    }
    else{
      res.send({ message: "user doesn't exist"});
    }
  } 
  )
})

app.post('/logout',function(req,res){
  
  console.log(req.session);
  req.session.destroy();
  console.log(req.session);
  if(req.session){
  res.send({message: "Session destoyed successfully"});
  }
  else{
     res.send({message: "error"});
  }
})

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});