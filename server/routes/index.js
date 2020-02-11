let jwt = require("jsonwebtoken");
let secretObj = require("../config/jwt");

module.exports = function(app, User) {
  // 회원 가입 (signup)
  app.post('/api/signup', function (req, res) {
    var user = new User();

    user.uid = req.body.uid;
    user.avatar = req.body.avatar;
    user.email = req.body.email;
    user.password = req.body.password;
    user.first = req.body.first;
    user.last = req.body.last;
    user.nickname = req.body.nickname;

    // 모든 필드 required 안 들어가게 체크하는 거 필요

    user.save(function (err) {
        if (err) {
            console.err(err);
            res.json({ success: false });
        } else { res.json({ success: true }); }
    });
  });

  // 아이디 중복 체크
  app.get('/api/idcheck/:uid', function (req, res) {
    User.find({ uid: req.params.uid }, function (err, users) {
      if (err) { res.status(500).json({error: err}); }
      else if (users.length) { res.json({success: true}); }
      else { res.json({success: false }); }
    });
  });

  // 로그인
  app.post('/api/signin', function (req, res) {
    // default : HMAC SHA256
    let token = jwt.sign({
      uid: req.body.uid,
    },
    secretObj.secret ,    // 비밀 키
    {
      expiresIn: '5m'    // 유효 시간은 5분
    });

    User.find({uid: req.body.uid, password: req.body.password}, function(err, users) {
      if (err) { return res.status(500).json({error: err}); }
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'not found user'
        });
      }

      const user = JSON.parse(JSON.stringify(users[0]));
      user.token = token;

      res.json({
        success: true,
        data: user,
      });
    });
  });

  // 자기 자신 정보 get
  app.get('/api/account/me', function (req, res) {
    const token = req.headers['x-access-token'];
    let decoded = jwt.decode(token);
    if (decoded && decoded.uid) {
      const uid = decoded.uid;
      User.find({ uid }, function (err, users) {
        if (err) { return res.status(500).json({error: err}); }
        if (users.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'not found user'
          });
        }

        res.json({
          success: true,
          data: users[0]
        });
      });
    } else{ res.json({success: false}); }
  });
}
