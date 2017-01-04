var fs=require('fs')//file System
var data=fs.readFileSync('data.txt',{encoding:'utf8'});
console.log(data);

console.log(1);
fs.readFile('data.txt',{encoding:'utf8'},function(err,data){
  console.log(2);
  console.log(data);
})
console.log(3);
/*
출력결과 1->3->2->data
비동기식은 fs의 readFile을 백그라운드로 던저버리고 계속 진행하기 때문이다!
*/
