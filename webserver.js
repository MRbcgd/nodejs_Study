//nodejs로 웹서버 생성, 1337포트 사용하여 127.0.0.1를 사용하는 사용자가 응답

const http = require('http');

const hostname = '127.0.0.1';//호스트이름 : 이 컴퓨터의 ip
const port = 1337;//포트번호, 연결통로

http.createServer((req, res) => {//서버 생성
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');//응답 message
}).listen(port, hostname, () => {//컴퓨터가 서버에 응답
  console.log(`Server running at http://${hostname}:${port}/`);
});
