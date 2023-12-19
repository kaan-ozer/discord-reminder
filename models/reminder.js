const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reminderSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  minute: {
    required: true,
    type: String,
  },
  hour: {
    required: true,
    type: String,
  },
  dayOfMonth: {
    required: true,
    type: String,
  },
  month: {
    required: true,
    type: String,
  },
  dayOfWeek: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model('Reminder', reminderSchema);
