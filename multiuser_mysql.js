var app=require('./config/mysql/express')();
var passport=require('./config/mysql/passport')(app);
var auth=require('./router/mysql/auth.js')(passport);
app.use('/auth',auth);

app.get('/welcome',function(req,res){

   if(req.user && req.user.displayName){//passport
     res.send(`<h1>welcome ${req.user.displayName}!</h1><a href="/auth/logout">logout</a>`);
   }
  // if(req.session.name){
  //   res.send(`<h1>welcome ${req.session.name}!</h1><a href="/auth/logout">logout</a>`);
  // }
   else{
    res.send('<h1>Welcome</h1><p><a href="/auth/login">login</a></p><p><a href="/auth/register">register</a></p><p><a href="/auth/facebook">facebook</a></p>');
  }
})



app.listen(3003,function(){
  console.log('Connected 3003 port!');
});
