var express = require('express');
var app = express();
var http = require('http').Server(app);
var pg = require('pg');
var io = require('socket.io')(http);
var ioclient = require('socket.io-client');

var pgConString = "postgres://localhost/gisdb"

app.use("/", express.static(__dirname + '/client'));

io.on('connection', function(socket){
  console.log('socket.io connection established');
	socket.on('pgsubscribe', function(data){
	  var client = new pg.Client(pgConString);
		client.connect();
		client.query('LISTEN inserts_updates');
		client.on('notification', function(msg){
		  console.log(msg);
			socket.emit('pgevent', msg.payload);
		});
	});
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});

                     

