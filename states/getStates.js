var db = require("../database/handleDB.js")


async function getStates(){
  var states =await db.read("select * from states");
  for(var i = 0;i<states.length; i++){
    global.states[states[i].devID]=states[i];
  }
}


module.exports=getStates;