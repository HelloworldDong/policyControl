var mqtt = require('mqtt');  
var client = mqtt.connect('mqtt://localhost:8000');

var device = {id:1,devID:1,level:100,running:1,wind:30,temp:26,air:11,time:"2018-04-28 19:39:51"};

var IDlist = [1,10,20,18]
client.on('connect', function () {
  client.publish('test',JSON.stringify(device),{qos:1,retain:'ture'});
  setInterval(function(){
    var lamp ={};
    lamp.id= Math.floor(Math.random()*100);
    lamp.devID=  IDlist[Math.round(Math.random()*(IDlist.length-1))];
    lamp.level = Math.floor(Math.random()*100);
    lamp.running= Math.round(Math.random());
    lamp.wind= Math.floor(Math.random()*50);
    lamp.temp= Math.floor(Math.random()*40);
    lamp.air= Math.floor(Math.random()*20);
    lamp.time = "2018-04-28 19:40:00";
    client.publish('test',JSON.stringify(lamp),{qos:1,retain:'ture'});
  },5000);
})