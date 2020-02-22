let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
var multer = require('multer')

module.exports = function(app, Image) {
  // 이미지 업로드
  var storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads');
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    }
  });

  app.post('/api/photo', function (req, res) {
    var upload = multer({ storage }).single('userFile');
    upload(req, res, function(err) {
      if (err) {
        return res.end("Error uploading file");
      }
      res.json({
        success: true
      });
    });
  });
}
