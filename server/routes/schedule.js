let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
let User = require('../models/user');

module.exports = function (app, Schedule) {
  // 일정 생성
  app.post('/api/schedule', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false });
      return;
    }

    var schedule = new Schedule();
    const required_fields = ['title', 'start', 'end', 'allDay', 'club', 'owner', 'galleries'];
    for (const field of required_fields) {
      if (req.body[field] === undefined) {
        res.json({ success: false, message: `${field} is required`});
      }

      schedule[field] = req.body[field];
    }

    schedule.updater = schedule.owner;
    schedule.created = schedule.updated = new Date().toString();

    User.findOne({ uid: decoded.uid }, { _id: true }, function(err, user) {
      if (err || !user) { res.status(500).json({ success: false }); }
      else {
        schedule.save(function (err, sch) {
          if (err) {
            res.status(500).json({ success: false, message: err.errmsg });
          } else { res.json({ success: true, data: sch }); }
        })
      }
    });
  });

  // 일정 리스트
  app.get('/api/schedule/:club', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function(err, user) {
      if (err || !user) { res.status(500).json({ success: false }); }
      else {
        Schedule.find({club: req.params.club}, function(err, schedules) {
          if (err) { res.status(500).json({ success: false, message: err.errmsg }); }
          else { res.json({ success: true, data: schedules }); }
        });
      }
    });
  });

  // 일정 수정
  app.put('/api/schedule/:id', function (req, res) {
    const id = req.params.id;
    body = req.body;

    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function(err, user) {
      if (err || !user) { res.status(500).json({ success: false }); }
      else {
        Schedule.update({ _id: id }, { $set: body }, function(err) {
          if (err) {
            res.status(500).json({ success: false, message: err.errmsg });
            return;
          }

          Schedule.findOne({ _id: id }, function (err, sch) {
            if (err) { res.status(500).json({ success: false, message: err.errmsg }); }
            else {
              res.json({
                success: true,
                data: sch
              });
            }
          });
        });
      }
    });
  });
}
