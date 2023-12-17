const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const logSchema = new Schema({
  IP: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  receivers: {
    type: [String],
    required: true,
  },
  http_status: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Log', logSchema);
