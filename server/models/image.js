var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
  saveName: { type: String, required: true },
  originalName: { type: String, required: true },
  contentType: { type: String, required: true },
  club: { type: String, required: true },
  album: { type: String },
  creator: { type: String, required: true },
  created: { type: String, required: true }
});
// data: { type: Buffer, required: true },

module.exports = mongoose.model('image', imageSchema);
