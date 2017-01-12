var express=require('express');
var app=express();

var p1=require('./router/p1')(app);
app.use('/p1',p1);

var p2=require('./router/p2');
app.use('/p2',p2);

app.listen(3003,function(){
  console.log('Connected 3000 port!');
});
