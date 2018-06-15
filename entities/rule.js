var db = require("../database/handleDB.js")
class rule {
  constructor(id, name, rif, rthen) {
    this.id = id;
    this.name = name;
    this.rif = rif;
    this.rthen = rthen;
  }
  setId(id) {
    this.id = id;
  }
  getId() {
    return this.id;
  }
  setName(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
  set(rif) {
    this.rif = rif;
  }
  getRif() {
    return this.rif;
  }
  setRthen(rthen) {
    this.rthen = rthen;
  }
  getRthen() {
    return this.rthen;
  }

  save(callback) {
    if(this.name==null){
      callback('parameter name needed');
    }else if(this.rif==null&&this.rthen==null){
      db.write('insert into rules(name) values(?)', [this.name], callback);  
    }else if(this.rif!=null&&this.rthen==null){
      db.write('insert into rules(name,rif) values(?,?)', [this.name, this.rif], callback);
    }else if(this.rif==null&&this.rthen!=null){
      db.write('insert into rules(name,rthen) values(?,?)', [this.name, this.rthen], callback);
    }else{
      db.write('insert into rules(name,rif,rthen) values(?,?,?)', [this.name, this.rif,this.rthen], callback);
    }
   
  }

  update(cb) {
    if(this.id==null||this.name==null){
      cb('id and name needed');
    }else if(this.rif==null&&this.rthen==null){
      db.write('update rules set name = ? where id = ?`', [this.name,this.id], cb);  
    }else if(this.rif!=null&&this.rthen==null){
      db.write('update rules set name = ? , rif = ? where id = ?`', [this.name,this.rif,this.id], cb);  
    }else if(this.rif==null&&this.rthen!=null){
      db.write('update rules set name = ? , rthen = ? where id = ?`', [this.name,this.rthen,this.id], cb);  
    }else{
      db.write(`update rules set name = ?,rif = ?, rthen = ? where id = ?`, [this.name, this.rif, this.rthen, this.id], cb);
    }
  }

  delete(cb) {
    if(this.id==null){
      cb('id needed');
    }else{
      db.write(`delete from rules where id = ?`, [this.id], cb);
    }
  }
  toJSON() {
    this.rif = this.rif==null?null:JSON.parse(this.rif);
    this.rthen = this.rthen==null?null:JSON.parse(this.rthen);
  }
}

module.exports = rule;