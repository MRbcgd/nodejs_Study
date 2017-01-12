var express=require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'qkrcjfgud12',
    database: 'o2'
};
var sessionStore = new MySQLStore(options);
app.use(session({
    key: 'session_Test',
    secret: 'fasfjlksd8521515',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));

app.get('/auth/login',function(req,res){
  var output=`
    <h1>Login</h1>
    <form action="/auth/login" method="POST">
    <p><input type="text" name="username" placeholder="username"></p>
    <p><input type="password" name="password" placeholder="password"></p>
    <p><input type="submit"></p>
    </form>
  `;
  res.send(output);
})
app.get('/auth/logout',function(req,res){
  delete req.session.name;
  req.session.save(function(){//redirect 해주면 돌아가는 과정에서 session이 적용안될수가 있기에 저장해주고 간다
    res.redirect('/welcome');
  })
})
app.get('/welcome',function(req,res){
  if(req.session.name){
    res.send('<h1>welcome master!</h1><a href="/auth/logout">logout</a>');
  } else{
    res.send('<a href="/auth/login">login</a>');
  }
})
app.post('/auth/login',function(req,res){
  var cust={
    username:'a',
    password:'a',
    name:'pch'
  };
  var username=req.body.username;
  var password=req.body.password;
  if(username==cust.username && password==cust.password){
    req.session.name=cust.name;
    req.session.save(function(){
      res.redirect('/welcome');
    })
  }
  else{
    res.send('<h1>Who are you?</h1><a href="/auth/login">login</a>');
  }
})
app.get('/count',function(req,res){
  if(req.session.count){
    req.session.count=parseInt(req.session.count)+1;
  } else{
    req.session.count=2;
  }
  res.send('count : '+req.session.count);

})
app.listen(3003,function(){
  console.log('Connected 3003 port!');
});
