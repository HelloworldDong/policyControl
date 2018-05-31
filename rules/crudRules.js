var express = require('express');
var router = express.Router();
var db = require("../database/handleDB.js");
var getRules = require('./getRules');
router.get('/', async function (req, res, next) {
  var data = await db.read('select * from rules');
  res.json(data);
});

router.post('/', function (req, res, next) {
  var rif = req.body.rif;
  var rthen = req.body.rthen;
  db.write(`insert into rules(rif,rthen) values(?,?)`, [rif, rthen], console.log);
});

router.delete('/', function (req, res, next) {
  var id = req.body.id;
  db.write(`delete from rules where id = ?`, [id], console.log);
});

router.put('/', function (req, res, next) {
  var id = req.body.id;
  var rif = req.body.rif;
  var rthen = req.body.rthen;
  db.write(`update rules set rif = ?, rthen = ? where id = ?`, [rif, rthen, id], console.log);
});

module.exports = router;