module.exports=function(passport){
  var connection=require('../../config/mysql/connection.js')();
  var route=require('express').Router();
  route.get('/login',function(req,res){
    res.render('auth/login');
  })
  route.post('/login',//passport
    passport.authenticate('local', { successRedirect: '/welcome',
                                     failureRedirect: '/auth/login',
                                     failureFlash: false })
  );
  route.get('/logout',function(req,res){
     req.logout();
     req.session.save(function(){
       res.redirect('/welcome');
     });
  })
  route.get('/register',function(req,res){
    res.render('auth/register')
  });
  route.post('/register',function(req,res){
    var user_={
      authId:'local:'+req.body.username,
      username:req.body.username,
      password:req.body.password,
      displayName:req.body.name
    };
    // req.session.name=user_.name;
    // return req.session.save(function(){
    //   res.redirect('/welcome');
    // })
    var sql='INSERT INTO users SET ?';

    connection.query(sql,user_,function(err,results){
      if(err){
        console.log(err);
        res.status(500);
      }
      else{
        res.redirect('/welcome');
      }
    });
  })
  route.get('/procedure',function(req,res){
    var options = {sql: 'SET @temp = 0; CALL sp_test(@temp); SELECT @temp;',nestTables:false};
    connection.query(
    options,
    function(err,rows){

      console.log('Data received from Db:\n');
      console.log(rows[2][0]);
      var temp=rows[2][0];
      for(var key in temp){
        var result=temp[key].toString();
        for (var i = 0; i < result.length; i++) {
          console.log(result[i]);
        }
      }
    }
  );
  })
  route.get('/function',function(req,res){

    var options = {sql: 'SET @username = "z"; CALL ?=ft_test(@username);',nestTables:false};
    connection.query(
    options,
    function(err,rows){

      console.log('Data received from Db:\n');
      console.log(rows);
      res.send(rows[2]);

    }
  );
  })
  route.get('/facebook',passport.authenticate('facebook',{scope:'email'}));//facebook
  route.get('/facebook/callback',//facebook
    passport.authenticate('facebook', { successRedirect: '/welcome',
                                        failureRedirect: '/auth/login' }));

  return route;
}
