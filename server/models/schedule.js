var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    allDay: { type: Boolean, required: true },
    club: { type: String, required: true },
    owner: { type: String, required: true },
    galleries: { type: Array, required: true },
    created: { type: String, required: true },
    updated: { type: String, required: true },
    updater: { type: String, required: true },
});

module.exports = mongoose.model('schedule', scheduleSchema);
