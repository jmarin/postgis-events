var database = 'gisdb';
var geomColumn = 'geometry';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var pg = require('pg');
var io = require('socket.io')(http);
var ioclient = require('socket.io-client');

var pgConString = "postgres://localhost/" + database;

app.use("/", express.static(__dirname + '/client'));

var clients = [];

io.on('connection', function(socket) {
  console.log('socket.io connection established', socket.id);
	socket.on('pgsubscribe', function(data){
	  console.log('pgsubscribe', socket.id);
		clients.push(socket);
	});
	socket.on('disconnect', function(){
	  console.log('disconnect from', socket.id);
		clients.splice(clients.indexOf(socket),1);
	});
});

var db = new pg.Client(pgConString);
db.connect();
db.query('LISTEN inserts_updates');
db.on('notification', function(msg) {
  console.log('notification');
	if (clients.length === 0) {
	  console.log('no clients');
		return;
	}
	var elems = msg.payload.split(',');
	console.log(elems);
	var schema = elems[0];
	var table_name = elems[1];
	var id = elems[2];
	var sql = 'SELECT ST_AsGeoJSON(' + geomColumn + ') FROM ' + schema + '.' + table_name + ' WHERE gid = ' + id;
	console.log(sql);
	db.query(sql, function(err, result) {
	  if (err) {
		  return console.error('Element not found', err);
		}
		clients.forEach(function(c) {
		  console.log('emit event', c.id);
			c.emit('pgevent', result.rows[0]);
		});
	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

                     

