var db = require("../database/handleDB.js")
var exe = require('./execute.js')

global.policy = [];
global.relation = new Map();
global.states = {};

/**
 * 
 * @param {int} id 
 * @param {string} str 
 */
var parseIf = function (id, str) {
  for (var i = 0; i < str.length; i++) {
    if (str[i] == '[') {
      var j = i;
      for (j; j < str.length; j++) {
        if (str[j] == ']')
          break;
      }
      if (j < str.length) {
        var devID = str.substr(i + 2, j - i - 3);
        if (global.relation.get(devID) == null) {
          global.relation.set(devID, [id]);
        } else {
          var rel = global.relation.get(devID);
          if (rel.indexOf(id) == -1)
            global.relation.get(devID).push(id);
        }
      }
    }
  }
  var result = '';
  for (var i = 0; i < str.length; i++) {
    if (str[i] != '[') {
      result += str[i];
    } else {
      result = result + 'devices' + str[i];
    }
  }
  return `if(${result})`;
}

/**
 * 
 * @param {string} param 
 */
var parseThen = function (param) {
  var todo = param.split(' ');
  switch (todo[0]) {
    case 'ON':
      return "exe.exe_on()";
    case 'OFF':
      return 'exe.exe_off()';
    case 'SET':
      return 'exe.exe_set()';
  }
}



async function getRules() {
  var rules = await db.read("select * from rules");
  console.log(rules)
  for (var i = 0; i < rules.length; i++) {
    var rif = parseIf(rules[i].id, rules[i].rif);
    var rthen = parseThen(rules[i].rthen);
    var newRule = new Function('devices', 'exe', rif + rthen);
    global.policy[rules[i].id] = newRule;
  }

  console.log(global.policy);
  console.log(global.relation)
}

function processIf(id,data){
  if(!data){
    return '';
  }
  if(data.and){
    var conditions=data.and;
    var str='';
    for(var i=0;i<conditions.length;i++){
      var result=''
      var cond=conditions[i];
      for(var key in cond){
        var device = key.split('.');
        if (global.relation.get(device[0]) == null) {
          global.relation.set(device[0], [id]);
        } else {
          var rel = global.relation.get(device[0]);
          if (rel.indexOf(id) == -1)
            global.relation.get(device[0]).push(id);
        }
        result=result+'devices['+device[0]+'].'+device[1];
        var op=cond[key];
        for(var key2 in op){
          switch(key2){
            case 'gt':
              result+='>';
              break;
            case 'lt':
              result+='<';
              break;
            case 'eq':
              result+='=';
              break;
            case 'gte':
              result+='>=';
              break;
            case 'lte':
              result+='<=';
              break;

          }
         result+=op[key2];
        } 
      }
      if(str==''){
        str=result;
      }
      else{
        str=str+"&&"+result;
      }
    }
    return str;
  }
  if(data.or){
    var conditions=data.or;
    var str='';
    for(var i=0;i<conditions.length;i++){
      var result=''
      var cond=conditions[i];
      for(var key in cond){
        var device = key.split('.');
        if (global.relation.get(device[0]) == null) {
          global.relation.set(device[0], [id]);
        } else {
          var rel = global.relation.get(device[0]);
          if (rel.indexOf(id) == -1)
            global.relation.get(device[0]).push(id);
        }
        result=result+'devices['+device[0]+'].'+device[1];
        var op=cond[key];
        for(var key2 in op){
          switch(key2){
            case 'gt':
              result+='>';
              break;
            case 'lt':
              result+='<';
              break;
            case 'eq':
              result+='=';
              break;
            case 'gte':
              result+='>=';
              break;
            case 'lte':
              result+='<=';
              break;

          }
         result+=op[key2];
        } 
      }
      if(str==''){
        str=result;
      }
      else{
        str=str+"||"+result;
      }
    }
    return str;
  }
}

function processThen(data){
  if(!data){
    return ''
  }
  var result=[];
  for(var i =0;i<data.length;i++){
    var action=data[i];
    for(var key in action){
      var device=key.split('.');
      switch(device[1]){
        case 'level':
         result.push(`set device ${device[0]} level = ${action[key]}`);
         break;
        case 'running':{
          if(action[key]==0)
           result.push(`turn on device ${device[0]}`);
          else
          result.push(`turn off device ${device[0]}`);
        }

      }
    }
  }
  return result;
}

var dataif={
  "or":[
    {"1.light":
     {
      "gt":10
     }
    },
    {
      "2.light":
      {
        "eq":20
      }
    }
  ]
}
var datathen=[
  {"1.light":20},
  {"2.running":1}
]

function stringToJson(data){
  if(!data){
    console.log("empty input");
    return;
  }
  var result = [];
  for(var i =0;i<data.length;i++){
    var obj={};
    obj.id=data[i].id;
    obj.name=data[i].name;
    obj.rif=JSON.parse(data[i].rif);
    obj.rthen =JSON.parse(data[i].rthen);
    result.push(obj)
  }
  return result;
}

function constructRules(){
  var getrules = db.read("select * from rules");
  getrules.then(data=>{
    var rules = stringToJson(data);
    for (var i = 0; i < rules.length; i++) {
      var rif = processIf(rules[i].id,rules[i].rif);
      var rthen = processThen(rules[i].rthen);
      if(rif!=''){
        var fun=`if(${rif}) console.log(${rthen})`
        console.log(fun)
        var newRule = new Function('devices', `if(${rif}) console.log("${rthen}")`);
        global.policy[rules[i].id] = newRule;
      }

    }
  },err=>{
    console.log('read rules error')
  });

}


module.exports = constructRules;