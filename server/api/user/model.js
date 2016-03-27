var config = require('../../config/config');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hash: String,
  salt: String
});

UserSchema.methods = {
  setPassword: function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  },
  validatePassword: function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash === hash;
  },
  generateJWT: function() {
    return jwt.sign({
      _id: this._id,
      username: this.username,
      exp: config.exp
    }, config.secrets.jwt);
  }
};

module.exports = mongoose.model('User', UserSchema);