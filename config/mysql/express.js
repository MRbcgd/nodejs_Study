module.exports=function(){
  var express=require('express');
  var app=express();
  var bodyParser = require('body-parser');
  var md5=require('md5');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session)
  var sessionStore = new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'qkrcjfgud12',
      database: 'o2'
  });
  app.set('views','./views/mysql');
  app.set('view engine','jade');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
      key: 'session_Test',
      secret: 'fasfjlksd8521515',
      store: sessionStore,
      resave: false,
      saveUninitialized: true
  }));
  
  return app;
}
