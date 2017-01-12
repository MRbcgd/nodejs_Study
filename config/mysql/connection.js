module.exports=function(){
  var mysql=require('mysql')
  var connection = mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'qkrcjfgud12',
      database: 'o2',
      multipleStatements: true
  });
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  return connection;
}
