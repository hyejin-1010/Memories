var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  created: { type: String, required: true }
})

module.exports = mongoose.model('image', imageSchema);
