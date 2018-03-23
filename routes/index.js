var express = require('express');
var app = express();
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('./config');
var MongoClient = require('mongodb').MongoClient,
  assert = require('assert');
app.set('superSecret', config.secret);

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
  MongoClient.connect(config.database, function (err, db) {
    var collection = db.collection('users');
    var user = req.body;

    collection.insertOne(user, function (err, result) {
      assert.equal(err, null);
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.header('Cache-Control', 'no-cache');
      res.send(JSON.stringify({
        result: 'ok'
      }));
    });

  });
});

router.post('/authenticate', function (req, res) {
  const userName = req.body.login;

  MongoClient.connect(config.database, function (err, db) {
    var collection = db.collection('users');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Cache-Control', 'no-cache');

    collection.findOne({
      login: userName
    }, function (err, user) {

      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else {
        if (user.password != req.body.password) {
          res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
          });
        } else {

          const payload = {
            admin: false
          };
          const token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 1440 // expires in 24 hours
          });

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        }
      }
    });
  });

});

router.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  if (req.method === "POST") {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, app.get('superSecret'), function (err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  }
  else {
    next();
  }

});

// mongo
router.post('/mongo', function (req, res, next) {
  let data = req.body;
  var url = 'mongodb://localhost:27017/myproject';
  // Use connect method to connect to the server
  MongoClient.connect(url, function (err, db) {
    var collection = db.collection('columns');

    collection.remove(function () {

      collection.insertMany([data], function (err, result) {
        assert.equal(err, null);
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
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Cache-Control', 'no-cache');
      res.send(docs);
    });

  });
});

module.exports = router;