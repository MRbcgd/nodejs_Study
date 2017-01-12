var express=require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var md5=require('md5');
var passport = require('passport');//passport
var LocalStrategy = require('passport-local').Strategy;//passport
var FacebookStrategy = require('passport-facebook').Strategy;//facebook 타사인증
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'qkrcjfgud12',
    database: 'o2'
};
var users=[
  {
   authId : 'local:Ohoi',
   username : 'Ohio',
   password : '0000',
   name : 'Ohio'
  },
  {
    authId : 'local:HK',
    username : 'HK',
    password : '0000',
    name : 'HK'
  }
];
var sessionStore = new MySQLStore(options);
app.use(session({
    key: 'session_Test',
    secret: 'fasfjlksd8521515',
    store: sessionStore,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());//passport 인증
app.use(passport.session());//passport 인증
passport.use(new FacebookStrategy({//facebook 타사인증
    clientID: '1887903354766711',
    clientSecret: '87bc244627e4ca18e100dfffe903f186',
    callbackURL: "/auth/facebook/callback"
   ,profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var authId=profile.id;
    for (var i = 0; i < users.length; i++) {
      var user=users[i];
      if(user.authId==authId){
        done(null,user);
      }
    }
    var newuser={
      authId:'local:'+authId,
      name:profile.displayName,
    //  email:profile.email[0].value
    }
    users.push(newuser);
    done(null,newuser);
  }
));

app.post('/auth/login',//passport
  passport.authenticate('local', { successRedirect: '/welcome',
                                   failureRedirect: '/auth/login',
                                   failureFlash: false })
);

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
app.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));//facebook
app.get('/auth/facebook/callback',//facebook
  passport.authenticate('facebook', { successRedirect: '/welcome',
                                      failureRedirect: '/auth/login' }));
app.get('/auth/logout',function(req,res){
   req.logout();
   req.session.save(function(){
     res.redirect('/welcome');
   });
   
})
app.get('/welcome',function(req,res){
   if(req.user && req.user.name){//passport
     res.send(`<h1>welcome ${req.user.name}!</h1><a href="/auth/logout">logout</a>`);
   }
  // if(req.session.name){
  //   res.send(`<h1>welcome ${req.session.name}!</h1><a href="/auth/logout">logout</a>`);
  // }
   else{
    res.send('<h1>Welcome</h1><p><a href="/auth/login">login</a></p><p><a href="/auth/register">register</a></p><p><a href="/auth/facebook">facebook</a></p>');
  }
})
passport.serializeUser(function(user, done) {//passport, 세션 접근마다 밑 deserializeUser를 호출
  done(null, user.authId);//전달받은 user의 user.authid를 deserializeUser로 보낸다.
});
passport.deserializeUser(function(id, done) {//passport, 세션정보가 호출될때마다 아래 작업을 통해 세션을 출력함
  for (var i = 0; i < users.length; i++) {
    var user=users[i];
    if(id==user.authId){
        return done(null,user);
    }
  }
  done('There is no id');//접속이 끊겼다가 접속하면 session은 파일에 남아있는데
  //지금 array로 회원정보를 만들어서 array에 회원정보가 없어서 위에 for문에서
  //사용자를 찾을수없기에 에러가생긴다. 그런경우에 이런 done을 통해 에러메세지를 보여준다!

});

passport.use(new LocalStrategy(//passport,처음 로그인을 하면 실행이된다.
  function(username, password, done) {
      var uname=username;
      var pass=password;
      for (var i = 0; i < users.length; i++) {
        var user=users[i];
        if(uname==user.username && pass==user.password){
          done(null,user);//위의 serializeUser으로 user정보를보낸다
        }
      }
      done(null,false);
      //res.send('<h1>Who are you?</h1><a href="/auth/login">login</a>');
  }
));

//passport 사용을 위해 주석처리
// app.post('/auth/login',function(req,res){
//   var username=req.body.username;
//   var password=req.body.password;
//   for (var i = 0; i < user.length; i++) {
//     if(username==user[i].username && password==user[i].password){
//       req.session.name=user[i].name;
//       return req.session.save(function(){
//         res.redirect('/welcome');
//       })
//     }
//   }
//   res.send('<h1>Who are you?</h1><a href="/auth/login">login</a>');
// })
app.get('/auth/register',function(req,res){
  var output=`
    <h1>Register</h1>
    <form action="/auth/register" method="POST">
    <p><input type="text" name="username" placeholder="username"></p>
    <p><input type="password" name="password" placeholder="password"></p>
    <p><input type="text" name="name" placeholder="name"></p>
    <p><input type="submit"></p>
    </form>
    `;
    res.send(output);
});
app.post('/auth/register',function(req,res){
  var user_={
    username:req.body.username,
    password:req.body.password,
    name:req.body.name
  };
  users.push(user_);
  // req.session.name=user_.name;
  // return req.session.save(function(){
  //   res.redirect('/welcome');
  // })
  req.login(user_,function(err){
    req.session.save(function(){//passport
      res.redirect('/welcome');
    })
  })
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
