'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    given: {
      type: String,
      required: true,
      default: 'Upbucket'
    },
    surname: {
      type: String,
      required: true,
      default: 'User'
    }
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  token: {
    type: String,
    require: true,
  },
  collaborators: {
    type: Array,
  },
  passwordDigest: String,
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

userSchema.plugin(uniqueValidator);

userSchema.virtual('fullName').get(function(){
  return this.name.given + ' ' + this.name.surname;
});

userSchema.methods.comparePassword = function (password) {
  let _this = this;

  return new Promise((resolve, reject) =>
    bcrypt.compare(password, _this.passwordDigest, (err, data) =>
        err ? reject(err) : data ? resolve(data) : reject(new Error('Not Authorized')))
    ).then(() => _this);
};

userSchema.methods.setPassword = function (password) {
  let _this = this;

  return new Promise((resolve, reject) =>
    bcrypt.genSalt(null, (err, salt) =>
        err ? reject(err) : resolve(salt))
  ).then((salt) =>
    new Promise((resolve, reject) =>
      bcrypt.hash(password, salt, (err, data) =>
        err ? reject(err) : resolve(data)))
  ).then((digest) => {
    _this.passwordDigest = digest;
    return _this.save();
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
