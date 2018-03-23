var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

/* GET home page. */
router.get('/', function (req, res, next) {
  if (err) throw err;
  // Prepare output in JSON format
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.end(JSON.stringify(result));
});

// GET columns
router.get('/columns', function (req, res, next) {
  if (err) throw err;
  // Prepare output in JSON format
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.end(JSON.stringify(result));
});

// register
router.post('/register', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Content-Type', 'application/json');
  res.header('Cache-Control', 'no-cache');
  console.log(req.body);
  res.send('reged');
});

// mongo
router.post('/mongo', function (req, res, next) {
  let data = req.body;
  console.log(req.body)
  var url = 'mongodb://localhost:27017/myproject';
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('columns');

    collection.remove(function () {

      collection.insertMany([data], function (err, result) {
        assert.equal(err, null);
        console.log("Inserted 3 documents into the collection");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header('Cache-Control', 'no-cache');
        res.send(JSON.stringify({
          result: 'ok'
        }));
      });

    });

  });
});

// mongo get
router.get('/mongo', function (req, res, next) {
  let data = req.body;

  var url = 'mongodb://localhost:27017/myproject';
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('columns');

    collection.find({}).toArray(function (err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Cache-Control', 'no-cache');
      res.send(docs);
    });

  });
});

module.exports = router;