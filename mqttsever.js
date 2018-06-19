var mosca = require('mosca');

var settings = { 
    port:8000,
}; 

var MqttServer = new mosca.Server(settings);   

MqttServer.on("clientConnected",function(client) {  
  console.log("client connected ",client.id);  
});  

MqttServer.on("clientDisconnected",function(client) {  
  console.log("client disconnected ",client.id);  
});  

MqttServer.on('ready', function(){
	console.log('Mosca server is up and running');	
});

MqttServer.on('published', function(packet, client) {
  console.log('Published', packet.payload.toString());
});