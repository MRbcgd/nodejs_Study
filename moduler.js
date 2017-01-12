var express=require('express');
var app=express();
var cal=require('./lib/calculator');
var sum=require('./lib/calculator');
console.log(cal.sum(1,2));
console.log(cal.avg(1,2));
console.log(sum(1,2));
console.log(avg(1,2));

app.listen(3003,function(){
  console.log('Connected 3000 port!');
});
