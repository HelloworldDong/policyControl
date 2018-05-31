var db = require("../database/handleDB.js")
var exe = require('./execute.js')


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

module.exports = getRules;