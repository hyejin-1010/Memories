var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    uid: String,
    avatar: String,
    email: String,
    password: String,
    first: String,
    last: String,
    created: String,
});

module.exports = mongoose.model('user', userSchema);
