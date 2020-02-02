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

    book.save(function (err) {
        if (err) {
            console.err(err);
            res.json({ success: false });
        } else { res.json({ success: true }); }
    });
  });
}
