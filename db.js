
var mysql = require('mysql2');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'coffee_and_mrt',
    multipleStatements:true
});

module.exports = connection;
/*
connection.connect();
connection.query('SELECT * from todos_table', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();*/