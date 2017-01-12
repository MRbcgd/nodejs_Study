//main과 같은 기능 app.js라는 이름을 쓰기를 권장
var express=require('express');//express 모듈 사용
var app=express();
var bodyParser = require('body-parser');//post방식의 body 사용을 위해
app.set('view engine','jade');//jade 사용
app.set('views','./views');//views 폴더생성
app.use(express.static('public'));//**정적인 파일서비스!, public에 있는 파일들을 정적으로 사용할수 있다.
app.use(bodyParser.urlencoded({ extended: false }));//body사용을 위해
app.get('/jade',function(req,res){
  res.render('temp.jade',{time:Date()});//temp.jade파일이 응답 (send와 반대개념), time 변수에 현재시각입력
})

app.get('/topic/',function(req,res){
  var topic=[
    'Ohio',
    'Seoul',
    'HK'
  ];
  //이런식으로 배열로도 받아올수있다.
  var text=`
    <ul>
      <li>${topic[req.query.tpcNo]}</li>
      <li>${topic[req.query.tpcNo]}</li>
      <li>${topic[req.query.tpcNo]}</li>
    </ul>
  `;
  res.send(text+req.query.name+','+req.query.age);//query String, url에 파라미터를 입력한다.
})
// localhost:3000/topic/1/edit 이런식으로 의미론적으로 받아오기 ->semantic URL
//semantic은 params을 사용한다.
app.get('/topic/:id/:mode',function(req,res){
  res.send(req.params.id+','+req.params.mode);
})

app.get('/form',function(req,res){
  res.render('form');
})
app.get('/form_post',function(req,res){
  res.render('form_post');
})

app.get('/form_receiver',function(req,res){//get방식으로 data를 가져왔다.
  res.send(req.query.name+','+req.query.board);
})
app.post('/form_receiver',function(req,res){//post방식
  var name=req.body.name;
  var board=req.body.board;
  res.send(name+','+board);
})
//url을 입력해서 접속하는것은 get방식
//get은 router, 요청이 들어왔을때 길을 찾아주는 역할
app.get('/',function(req,res){//사용자가 home으로 접속했을때 '/'는 home 최상단
//req 요청, res 응답
  res.send('Hello home page');//send()의 값을 resonse할 것이다
});
app.get('/login',function(req,res){//사용자가 login으로 접속시
  res.send('login please');
});
app.get('/dynamic', function(req,res){
  var date=Date();
  var lis='';
  for (var i = 0; i < 5; i++) {
    lis+='<li>HK</li>';
  }//${lis} 이렇게 대입
  //`` esc와 tab사이
  var output=`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
      Hello, dynamic
      <ul>
        ${lis}
      </ul>
      ${date}
    </body>
  </html>
`;
  res.send(output);
})
app.get('/route',function(req,res){
  res.send('<img src="/hk.png">');//public이 정적으로 사용되기 때문에!
});
app.listen(3000,function(){
  console.log('Connected 3000 port!');
});
