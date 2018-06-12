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

  save(callback){
    db.write('insert into rules(name,rif,rthen) values(?,?,?)',[this.name,this.rif,this.rthen],callback);
  }

  update(cb){
    db.write(`update rules set name = ?,rif = ?, rthen = ? where id = ?`, [this.name,this.rif, this.rthen, this.id], cb);
  }
 
  delete(cb){
    db.write(`delete from rules where id = ?`, [this.id], cb);
  }
  toJSON(){
    this.rif=JSON.parse(this.rif);
    this.rthen=JSON.parse(this.rthen);
  }

}

module.exports = rule ;