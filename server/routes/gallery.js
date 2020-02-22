// import * as formidable from 'formidable';

let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
var multer = require('multer');
var formidable = require('formidable');
var uuid = require('uuid-random');


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
  });
}
