const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const domainSchema = new Schema({
  domain_name: {
    type: String,
    required: true,
  },
  purchase_date: {
    type: String,
    required: true,
  },
  expiration_date: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Domain', domainSchema);
