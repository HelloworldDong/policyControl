var mqtt = require('mqtt');  
var client = mqtt.connect('mqtt://localhost:8000');

var device = {id:1,devID:'088C',light:100,online:1};

client.on('connect', function () {
  client.publish('test',JSON.stringify(device),{qos:1,retain:'ture'});
})


