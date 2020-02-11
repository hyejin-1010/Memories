var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    uid: { type: String, required: true },
    avatar: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
    first: { type: String, required: true },
    last: { type: String, required: true },
    created: String,
});

module.exports = mongoose.model('user', userSchema);
