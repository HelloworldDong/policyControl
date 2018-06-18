var db = require("./database/handleDB.js")
var getStates = require('./states/getStates');
var exe = require('./rules/execute');
function processMsg(msg){
  console.log(msg);
  db.write(`update states set level =?, running = ? where id = ? and devID = ?`,[msg.light,msg.online,msg.id,msg.devID],
    async function(results){
      console.log(results);
      var relatedRules = global.relation.get(msg.devID);
      if(!relatedRules) return;
      console.log(relatedRules)
      relatedRules = handleConflict(relatedRules);
      await getStates();
      for(var i=0;i<relatedRules.length;i++){
        var index = relatedRules[i];
        console.log(index);
        console.log(global.policy[index].toString())
        global.policy[index](global.states,exe);
      }
  });
  
}

function handleConflict(rules){
  var s = new Set();
  for(let i = 0; i<rules.length; i++){
    let rthen = global.policy[rules[i]].rthen;
    let device = rthen.split(' ')[1];
    s.add(device);
  }
  return Array.from(s);
}

function handleMsg(data){
  global.states[data.devID]=data;
  var relatedRules = global.relation.get(data.devID);
  if(!relatedRules) return;

  console.log(relatedRules)
  for(var i=0;i<relatedRules.length;i++){
    var index = relatedRules[i];
    global.policy[index](global.states);
  }
}



module.exports = handleMsg;