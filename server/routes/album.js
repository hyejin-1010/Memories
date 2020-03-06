let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
let User = require('../models/user');
let Image = require('../models/image');

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

  // 앨범 리스트
  app.get('/api/album', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false, message: 'not user' });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function (err, user) {
      if (err) { res.status(500).json({ success: false }); }
      else if (!user) { res.status(401).json({ success: false }); }
      else {
        Album.find({ club: req.query.club }, function (err, albums) {
          if (err) { res.status(500).json(); }
          else {
            albums = JSON.parse(JSON.stringify(albums));
            for (let index = 0; index < albums.length; index++) {
              Image.findOne({ album: albums[index]._id }, function (err, image) {
                if (!err && image) { albums[index].image = image; }
                if (index === (albums.length - 1)) {
                  res.json({
                    success: true,
                    data: albums
                  });
                }
              });
            }
          }
        });
      }
    });
  });

  // 앨범 내 이미지 리스트
  app.get('/api/album/:id', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false, message: 'not user' });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function (err, user) {
      if (err) { res.status(500).json({ success: false }); }
      else if (!user) { res.status(401).json({ success: false }); }
      else {
        Image.find({ album: req.params.id }, function (err, images) {
          if (err) { res.status(500).json(); }
          else {
            res.json({ success: true, data: images });
          }
        });
      }
    });
  });
}
