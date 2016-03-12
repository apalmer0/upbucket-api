'use strict';

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  comment: {
    type: String
  }
}, {
  timestamps: true
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
