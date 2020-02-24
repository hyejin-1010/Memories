var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = new Schema({
  title: { type: String, required: true },
  club: { type: String, required: true },
  created: { type: String, required: true }
});

module.exports = mongoose.model('album', albumSchema);
