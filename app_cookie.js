var express=require('express');
var app=express();
var cookieParser=require('cookie-parser');//cookie 사용을 위해
app.use(cookieParser('ksdamfskmfsdkfmsdkl588883'));//cookie 사용을 위해 안에문자를 넣어주면 https방식
//rmsid cookieParser() 하면 그냥 http
var products={
  1:{title:'The history of Web 1'},
  2:{title:'The next Web'}
};
app.get('/products',function(req,res){
  var output=``;
  for(var name in products){
    if(products[name]!=null){
      output+=`<li><a href="/cart/${name}">${products[name].title}</a> <a href="/cart/${name}/delete">delete</a></li>`;
    }
  }
  res.send(`<h1>Products</h1>
            <ul>${output}</ul>
            <a href="/cart">cart</a>
            `);
})
app.get('/cart/:id',function(req,res){
  var id=req.params.id;
  if(req.cookies.cart){
    var cart=req.cookies.cart;
  } else{
    var cart={};
  }
  if(!cart[id]){
    cart[id]=0;
  }
  cart[id]=parseInt(cart[id])+1;
  res.cookie('cart',cart);
  res.redirect('/cart')
})
app.get('/cart',function(req,res){
  var cart=req.cookies.cart;
  var output=``;
  if(!cart){
    res.send('Empty Cart!');
  } else{
    for(var name in products){
      if(products[name]!=null)
        output+=`<li>${products[name].title} (${cart[name]})</li>`
    }
    res.send(`<h1>cart</h1><ul>${output}</ul><a href="/products">products list</a>`)
  }
})
app.get('/cart/:id/delete',function(req,res){
  var id=req.params.id;
  var cart=req.cookies.cart;
  if(!cart){
    console.log('cart is empty');
    res.status(500).send('Internal Server Error');
  }
  cart[id]=null;
  products[id]=null;
  res.cookie('cart',cart);
  res.redirect('/cart');
})
//req.cookies.count와 req.signedCookies.count 는 http와 https 방식 차이
app.get('/count',function(req,res){
  if(req.signedCookies.count){//cookie가 있다면
    var count=parseInt(req.signedCookies.count);//정수화
  } else{
    var count=0;//없으면 초기화
  }
  count=count+1;
  res.cookie('count',count,{signed:true});//cookie에 저장, 뒤에 signed:true를 해주면 https 방식 
  res.send('count : '+req.signedCookies.count);
})
app.listen(3003,function(){
  console.log('Connected 3000 port!');
});
