var express=require('express');
var app=express();
var bodyParser = require('body-parser');
var fs=require('fs');//File 관련 라이브러리
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'qkrcjfgud12',
  database : 'o2',
});
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

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
app.set('views','./views_mysql');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/topic/add',function(req,res){
  var sql='SELECT * FROM topic';
  connection.query(sql,function(err, topics, fields) {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.render('add',{topics:topics});
  });
});
app.get(['/topic','/topic/:id'],function(req,res){//url로 직접 들어왔을경우
  var sql='SELECT * FROM topic';
  connection.query(sql,function(err, topics, fields) {
    var id=req.params.id;
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else{

    }
  });
});
app.get(['/topic/:id/edit'],function(req,res){//url로 직접 들어왔을경우
  var sql='SELECT * FROM topic';
  connection.query(sql,function(err, topics, fields) {
    var id=req.params.id;
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    if(id){
      var sql='SELECT * FROM topic WHERE id=?';
      connection.query(sql,[id],function(err,topic,fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          res.render('edit.jade',{topics:topics,topic:topic[0]});
      });
    }
    else{
      console.log('There is no id');
      res.status(500).send('Internal Server Error');
    }
  });
});
app.post('/topic/:id/edit',function(req,res){
  var id=req.params.id;
  var title=req.body.title;
  var description=req.body.description;
  var author=req.body.author;
  if(id){
   var sql='UPDATE topic SET title=?,description=?,author=? WHERE id=?';
   connection.query(sql,[title,description,author,id],function(err,result,fields){
     if(err){
       console.log(err);
       res.status(500).send('Internal Server Error');
     }
     res.redirect('/topic/'+id);
   });
  }
  else{
    console.log('There is no id');
    res.status(500).send('Internal Server Error');
  }
})
app.post('/topic',function(req,res){
  var title=req.body.title;
  var description=req.body.description;
  var author=req.body.author;

  var sql='INSERT INTO topic(title,description,author) VALUES (?,?,?)';
  connection.query(sql,[title,description,author],function(err, result, fields) {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    res.redirect('/topic/'+result.insertId);
  });
});
app.get('/topic/:id/delete',function(req,res){
  var sql='SELECT * FROM topic';
  connection.query(sql,function(err, topics, fields) {
    var id=req.params.id;
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    if(id){
      var sql='SELECT * FROM topic WHERE id=?';
      connection.query(sql,[id],function(err,topic,fields){
          if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
          }
          res.render('delete.jade',{topics:topics,topic:topic[0]});
      });
    }
    else{
      console.log('There is no id');
      res.status(500).send('Internal Server Error');
    }
  });
})
app.post('/topic/:id/delete',function(req,res){
  var id=req.params.id;
  var title=req.body.title;
  var description=req.body.description;
  var author=req.body.author;

  var sql='DELETE FROM topic WHERE id=?';
  connection.query(sql,[id],function(err, result, fields) {
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    }
    else{
      if(id){
        res.redirect('/topic');
      }
      else{
        console.log('There is no id');
        res.status(500).send('Internal Server Error');
      }
    }
  });
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
