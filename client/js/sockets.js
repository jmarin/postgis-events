var socket = io.connect(window.location.hostname);
		
socket.on('connect', function(){
  self.socket.emit('pgsubscribe');								
});

socket.on('pgevent', function(msg){
	updateFeatures(msg);
});

