module.exports=function(app){
  var connection=require('./connection.js')();
  var passport = require('passport');//passport
  var LocalStrategy = require('passport-local').Strategy;//passport
  var FacebookStrategy = require('passport-facebook').Strategy;//facebook 타사인증
  app.use(passport.initialize());//passport 인증
  app.use(passport.session());//passport 인증


  passport.serializeUser(function(user, done) {//passport, 세션 접근마다 밑 deserializeUser를 호출
    done(null, user.authId);//전달받은 user의 user.authid를 deserializeUser로 보낸다.
  });
  passport.deserializeUser(function(id, done) {//passport, 세션정보가 호출될때마다 아래 작업을 통해 세션을 출력함
    var sql='SELECT * FROM users where authId=?';
    connection.query(sql,[id],function(err,results){
      if(err){
        console.log(err);
        return done('There is no user');
      }
      else{
        return done(null,results[0]);
      }
    })
  });

  passport.use(new LocalStrategy(//passport,처음 로그인을 하면 실행이된다.
    function(username, password, done) {
        var uname=username;
        var pass=password;
        var sql='SELECT * FROM users WHERE authId=?';
        connection.query(sql,['local:'+uname],function(err,results){
          if(err){
            console.log(results);
            return done('There is no user');
          }
            var user=results[0];
            if(uname==user.username && pass==user.password){
              done(null,user);//위의 serializeUser으로 user정보를보낸다
            }
            else{
              done(null,false);
            }
        })
        //res.send('<h1>Who are you?</h1><a href="/auth/login">login</a>');
    }
  ));
  passport.use(new FacebookStrategy({//facebook 타사인증
      clientID: '1887903354766711',
      clientSecret: '87bc244627e4ca18e100dfffe903f186',
      callbackURL: "/auth/facebook/callback"
     ,profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      var authId='local:'+profile.id;
      var sql='SELECT * FROM users WHERE authId=?';
      connection.query(sql,[authId],function(err,results){
        if(err){
          console.log(err);
          return done('FACEBOOK LOGIN ERR');
        }
        else{
          if(results.length>0){
            var user=results[0];
            done(null,user);
          }
          else{
            var newuser={
              authId:authId,
              displayName:profile.displayName,
            //  email:profile.email[0].value
            }
            var sql='INSERT INTO users SET ?';
            connection.query(sql,[newuser],function(err,results){
              if(err){
                console.log(err);
                done('err');
              }
              else{
                done(null,results[0]);
              }
            })
          }
        }
      })
    }
  ));
  return passport;
}
