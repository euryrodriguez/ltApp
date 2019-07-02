const mysql = require('mysql');

exports.con = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: '123456',
    database: 'lotoApp'
});