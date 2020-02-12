var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clubSchema = new Schema({
    title: { type: String, required: true },
    owner: { type: String, required: true },
    members: { type: Array, required: true },
    created: String,
});

module.exports = mongoose.model('club', clubSchema);
