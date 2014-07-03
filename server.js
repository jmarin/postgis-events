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

io.on('connection', function(socket){
  console.log('socket.io connection established');
	socket.on('pgsubscribe', function(data){
	  var client = new pg.Client(pgConString);
		client.connect();
		client.query('LISTEN inserts_updates');
		client.on('notification', function(msg){
			var elems = msg.payload.split(',');
			var schema = elems[0];
			var table_name = elems[1];
			var id = elems[2];
			var sql = 'SELECT ST_AsGeoJSON(' + geomColumn + ') FROM ' + schema + '.' + table_name + ' WHERE gid = ' + id;
		  client.query(sql, function(err, result){
			  if (err) {
				  return console.error('Element not found', err);
				}
				socket.emit('pgevent', result.rows[0]);
			});
		});
	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

                     

