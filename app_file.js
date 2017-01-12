var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var fs=require('fs');//File 관련 라이브러리


var multer  = require('multer');//파일전송 라이브러리
var upload = multer({ dest: 'uploads/' });//파일이 저장될 목적지 destination
var storage = multer.diskStorage({//파일의 실제이름을 저장하기위해서
  destination: function (req, file, cb) {
    cb(null, 'uploads/')//저장경로
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)//파일의 실제이름
  }
})
var upload = multer({ storage: storage })//실제 컴퓨터에 저장된다.

app.set('view engine','jade');
app.set('views','./views_file');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/topic/new',function(req,res){
  fs.readdir('data', function(err,files){//fs.readdir(데이터폴도명,콜백(에러,파일배열화))
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('new',{topics:files});
  });
});
app.get(['/topic','/topic/:id'],function(req,res){//url로 직접 들어왔을경우
  var id=req.params.id;
  fs.readdir('data', function(err,files){//fs.readdir(데이터폴도명,콜백(에러,파일배열화))
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    if(id){
      fs.readFile('data/'+id,'utf8',function(err,data){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        }
        res.render('view',{topics:files,title:id,description:data});
      });
    }
    else{
      res.render('view',{topics:files,title:'Welcome',description:'Web Page'});//파일명 전달
    }
  });
});
/* 중복제거를 위해 위와 배열을 통해 합쳐준다.
app.get('/topic/:id',function(req,res){
  var id=req.params.id;
  fs.readdir('data', function(err,files){//fs.readdir(데이터폴도명,콜백(에러,파일배열화))
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    fs.readFile('data/'+id,'utf8',function(err,data){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      }
      res.render('view',{topics:files,title:id,description:data});
    });
  });
})
*/
app.post('/topic',function(req,res){
  var title=req.body.title;
  var description=req.body.description;
  fs.writeFile('data/'+title,description,function(err){//writeFile(파일경로,내용,콜백)
    if(err){
      console.log(err);//해킹을 방지하기 위해 err는 콘솔로 개인이 볼수있게 한다.
      res.status(500).send('Internal Server Error');//status(500)은 컴퓨터간의 소통
    }
    res.redirect('/topic/'+title);//저장후에 바로 확이하기 위해
  })
});
app.get('/upload',function(req,res){
  res.render('uploadform');
})
app.post('/upload',upload.single('userfile'),function(req,res){
  console.log(req.file);
  res.send('uploaded : '+req.file.filename);
})
app.listen(3000,function(){
  console.log('Connected 3000 port!');
});
