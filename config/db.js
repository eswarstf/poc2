'user strict';

var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test1'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

module.exports = connection;