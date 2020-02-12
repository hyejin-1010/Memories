let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
let User = require('../models/user');

module.exports = function (app, Club) {
  // 모임 생성
  app.post('/api/club', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.json({ success: false });
      return;
    }
    if (!req.body.title) {
      res.json({ success: false });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function(err, user) {
      if (err || !user) { res.status(500).json({ success: false }); }
      else {
        var club = new Club();
        club.title = req.body.title;
        club.created = new Date().toString();
        club.owner = user._id;
        club.members = [];

        club.save(function (err, data) {
          if (err) {
            res.status(500).json({ success: false });
          } else { res.json({ success: true, data }); }
        });
      }
    });
  });

  // 모임 리스트
  app.get('/api/club', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false, message: 'not found token'});
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function(err, user) {
      if (err || !user) {
        res.status(401).json({success: false, message: 'not found user'});
        return;
      }

      Club.find({ $or: [{
        owner: user._id,
      }, {
        members: {
          $in: [user._id]
        }
      }]}, function(err, clubs) {
        if (err) { res.status(500).json({success: false, message: err.errmsg, id: user._id}); }
        else {
          res.json({
            success: true,
            data: clubs,
          });
        }
      });
    });
  });

   // 모임
   app.get('/api/club/:id', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false, message: 'not found token'});
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function(err, user) {
      if (err || !user) {
        res.status(401).json({success: false, message: 'not found user'});
        return;
      }

      Club.findOne({ _id: req.headers._id }, function(err, club) {
        if (err) { res.status(500).json({success: false, message: err.errmsg, id: user._id}); }
        else if (!club) {
          res.status(404).json({
            success: false,
            message: 'not found club'
          });
        } else {
          res.json({
            success: true,
            data: club,
          });
        }
      });
    });
  });
}
