let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
let User = require('../models/user');

module.exports = function (app, Album) {
  // 앨범 생성
  app.post('/api/album', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.json({ success: false });
      return;
    }

    var album = new Album();
    for (const field of ['title', 'club']) {
      if (!req.body[field]) {
        res.json({ success: false, message: `${field} is required`});
        return;
      }
      album[field] = req.body[field];
    }
    album.created = new Date().toString();

    User.findOne({ uid: decoded.uid }, { _id: true }, function (err, user) {
      if (err) { res.status(500).json({ success: false }); }
      else if (!user) { res.status(401).json({ success: false }); }
      else {
        album.save(function (err, data) {
          if (err) {
            res.status(500).json({ success: false });
          } else { res.json({ success: true, data }); }
        });
      }
    });
  });
}
