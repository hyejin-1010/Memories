let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
var multer = require('multer');
var formidable = require('formidable');
var uuid = require('uuid-random');
var fs = require('fs');
let User = require('../models/user');

module.exports = function(app, Image) {
  var id = null;

  // 이미지 업로드
  var storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads');
    },
    filename(req, file, cb) {
      cb(null, id + file.originalname);
    }
  });

  app.post('/api/photo', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false, message: 'not user' });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function (err, user) {
      if (err) { res.status(500).json({ success: false }); }
      else {
        var form = new formidable.IncomingForm();
        id = uuid();
        var upload = multer({ storage }).single('userFile');
        const image = new Image();

        form.parse(req, function(err, fields, files) {
          if (err) {
            console.log(err);
            return;
          }

          const file = files.userFile;
          image.saveName = id + file.name;
          image.originalName = file.name;
          image.contentType = file.type;
          image.created = new Date().toString();
          image.club = fields.club;
          if (fields.album) { image.album = fields.album; }
          image.creator = user._id;
        });

        upload(req, res, function(err) {
          if (err) {
            return res.end("Error uploading file");
          }

          image.save(function(err, image) {
            if (err) { res.status(500).json({ success: false }); }
            else {
              res.json({
                success: true,
                data: image
              });
            }
          });
        });
      }
    });
  });

  app.get('/api/gallery', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (!decoded || !decoded.uid) {
      res.status(401).json({ success: false, message: 'not user' });
      return;
    }

    User.findOne({ uid: decoded.uid }, { _id: true }, function (err, user) {
      if (err) { res.status(500).json({ success: false }); }

      Image.find({ club: req.query.club }, function (err, images) {
        if (err) { res.status(500).json(); }
        else {
          res.json({
            success: true,
            data: images
          });
        }
      });
    });
  });

  app.get('/api/file/:id', function (req, res) {
    Image.findOne({ _id: req.params.id }, function (err, image) {
      if (err) { res.status(500).json(); }
      else if (!image) { res.json({ success: false, id: req.params.id }); }
      else {
        fs.readFile(`./uploads/${image.saveName}`,              //파일 읽기
          function (err, data)
          {
              //http의 헤더정보를 클라이언트쪽으로 출력
              //image/jpg : jpg 이미지 파일을 전송한다
              //write 로 보낼 내용을 입력
              res.writeHead(200, { "Context-Type": image.contentType });//보낼 헤더를 만듬
              res.write(data);   //본문을 만들고
              res.end();  //클라이언트에게 응답을 전송한다
          }
      );
      }
    });
  })
}
