var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const cors = require('cors');

// [CONFIGURE mongoose]

// connect to mongodb server
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function() {
    // connected to mongodb server
    console.log('Connected to mongodb server');
});

mongoose.connect('mongodb://localhost/memories'); // mongodb_tutorial : Database

// define model
var User = require('./models/user');
var Club = require('./models/club');
var Schedule = require('./models/schedule');
var Image = require('./models/image');

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,x-access-token');
  next();
}

// [CONFIGURE APP TO USE bodyParser]
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(allowCrossDomain);
app.use(cors());

// [CONFIGURE SAVER PORT]
var port = process.env.PORT || 8080;

// [CONFIGURE ROUTER]
var router = require('./routes')(app, User);
var clubRouter = require('./routes/club')(app, Club);
var scheduleRouter = require('./routes/schedule')(app, Schedule);

var galleryRouter = require('./routes/gallery')(app, Image);

// [RUN SERVER]
var server = app.listen(port, function() {
    console.log('Express server has started on port ' + port);
});
