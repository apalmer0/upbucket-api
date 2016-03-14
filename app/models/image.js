'use strict';

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  comment: {
    type: String
  }
}, {
  timestamps: true,
  toObject: { virtuals: true }, // like serializing
  toJSON: { virtuals: true }
});

imageSchema.virtual('cleanCreatedAt').get(function(){
  let trimmedDate = this.createdAt.toISOString().split('T')[0];
  let trimmedDateArr = trimmedDate.split('-');
  return trimmedDateArr[1] + '/' + trimmedDateArr[2];
});
imageSchema.virtual('cleanUpdatedAt').get(function(){
  let trimmedDate = this.updatedAt.toISOString().split('T')[0];
  let trimmedDateArr = trimmedDate.split('-');
  return trimmedDateArr[1] + '/' + trimmedDateArr[2];
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
