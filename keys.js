var mysql = require('mysql');

var connection = mysql.createConnection({
	host:"localhost",
	port:8080,
	user:"root",
	password:"Legend@ry81",
	database:"bamazon"
});

module.exports = connection;