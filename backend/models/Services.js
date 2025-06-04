const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id : String,
  name : String,
  shortDescription : String
});

module.exports = mongoose.model('Services', serviceSchema);
