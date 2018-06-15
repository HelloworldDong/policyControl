var express = require('express');
var router = express.Router();
var Rule = require('../entities/rule.js');
var db = require("../database/handleDB.js");

router.get('/', function (req, res, next) {
  var search_name = req.query.search_name;
  // var name = req.query.name;
  var name = search_name;//这边已经传过来了
  console.log('name----', name)
  var limit = Number(req.query.limit || 20);
  var offset = Number(req.query.offset || 0);
  if (name) {
    var getData = db.read("select * from rules where name like ? limit ? offset ?", [`%${name}%`, limit, offset]);
    getData.then(data => {
      res.status(200).json(data);
      console.log("有的data-------")
      console.log("data-------", data)

    }, err => {
      console.log("有的err------")
      console.log("err------", err)

      res.status(400).send(err);
    })
  } else {
    var getData = db.read("select * from rules limit ? offset ?", [limit, offset]);
    getData.then(data => {
      res.status(200).json(data);
    }, err => {
      res.status(400).send(err);
    })
  }
});

router.get('/count', function (req, res) {
  var name = req.query.name;
  if (name) {
    var getNum = db.read("select count(*) from rules where name like ?", [`%${name}%`]);
    getNum.then(data => {
      let value = {};
      value.num = data[0]['count(*)'];
      res.status(200).json(value);
    }, err => {
      res.status(400).send(err);
    })
  } else {
    var getData = db.read("select count(*) from rules");
    getData.then(data => {
      let value = {};
      value.num = data[0]['count(*)'];
      res.status(200).json(value);
    }, err => {
      res.status(400).send(err);
    })
  }
});

router.get('/:id', function (req, res) {
  var id = req.params.id;
  var getRule = db.read('select * from rules where id = ?', [id]);
  getRule.then(data => {
    res.status(200).json(data[0]);
  }, err => {
    res.status(400).send(err);
  });

});

router.post('/', function (req, res) {
  if (!req.body) {
    console.log("post没有req.body")
    res.status(400).send('parameter needed');
    return;
  }
  console.log('req.body', req.body)
  // var param = JSON.parse(req.body);
  var param = req.body;
  param.name = param.policy_name;
  console.log('param-----', param)
  var arule = new Rule(null, param.name, JSON.stringify(param.rif), JSON.stringify(param.rthen));
  console.log('arule-----', arule)

  arule.save((err, result) => {
    if (err) {
      res.status(500).send(err);
    }
    else {
      arule.setId(result.insertId)
      arule.toJSON();
      res.status(201).json(arule);
    }
  });
});

router.delete('/:id', function (req, res) {
  console.log('删除req.params.id', req.params.id)
  var arule = new Rule(req.params.id, null, null, null);
  arule.delete(err => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.sendStatus(204);
    }
  });
});

router.put('/:id', function (req, res) {
  if (!req.body) {
    res.status(400).send('parameter needed');
    return;
  }
  console.log('req.body---', req.body)
  var data = JSON.parse(req.body);
  console.log('更新的数据data', data)
  var arule = new Rule(Number(req.params.id), data.name, JSON.stringify(data.rif), JSON.stringify(data.rthen));
  arule.update((err, result) => {
    if (err) {
      console.log('err--------', err)
      res.status(409).send(err);
    } else {
      console.log('修改的。。没有err--------')

      arule.toJSON();
      res.status(200).json(arule);
    }
  });
});

module.exports = router;