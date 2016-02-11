var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
var environment = process.env.NODE_ENV || 'development';

if (environment === 'development') {
  var User = db.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    initialize: function(){
      this.on('creating', this.hashPassword);
    },
    comparePassword: function(attemptedPassword, callback) {
      bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
        callback(isMatch);
      });
    },
    hashPassword: function(){
      var cipher = Promise.promisify(bcrypt.hash);
      return cipher(this.get('password'), null, null).bind(this)
        .then(function(hash) {
          this.set('password', hash);
        });
    }
  });
} else {
  //add functions

  var User = mongoose.model('User', db.userSchema);
}

module.exports = User;