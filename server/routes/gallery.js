let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");
const  multipart  =  require('connect-multiparty');
const  multipartMiddleware  =  multipart({ uploadDir:  './uploads' });

module.exports = function(app, Image) {
  // 이미지 업로드
  app.post('/api/photo’', multipartMiddleware, function (req, res) {
    /*
    var image = new Image();
    image.data = fs.readFileSync(req.files.userPhoto.path);
    image.contentType = 'image/png';
    image.save();
    */
   res.json({
     message: 'success image upload',
   });
  });
}
