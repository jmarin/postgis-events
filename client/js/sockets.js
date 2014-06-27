var socket = io.connect('http://localhost');
		
socket.on('connect', function(){
  self.socket.emit('pgsubscribe');								
});

socket.on('pgevent', function(msg){
  console.log(msg);							
});

