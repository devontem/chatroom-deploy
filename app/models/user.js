// var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');
// var environment = process.env.NODE_ENV || 'development';

  
  // var User = db.Model.extend({
  //   tableName: 'users',
  //   hasTimestamps: true,
  //   initialize: function(){
  //     this.on('creating', this.hashPassword);
  //   },
  //   comparePassword: function(attemptedPassword, callback) {
  //     bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
  //       callback(isMatch);
  //     });
  //   },
  //   hashPassword: function(){
  //     var cipher = Promise.promisify(bcrypt.hash);
  //     return cipher(this.get('password'), null, null).bind(this)
  //       .then(function(hash) {
  //         this.set('password', hash);
  //       });
  //   }
  // });

  //add functions
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    username : {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    password : {
      type: String,
      required: true
    },   
  }, { 
    timestamps: true 
  });


  

  userSchema.methods.comparePassword = function(attemptedPassword, savedPassword, callback) {
    bcrypt.compare(attemptedPassword, savedPassword, function(err, isMatch) {
      callback(isMatch);
      });
  }

  userSchema.methods.hashPassword = function() {
    var cipher = Promise.promisify(bcrypt.hash);
      return cipher(this.password, null, null).bind(this)
        .then(function(hash) {
          this.password = hash;
        });
  }

  userSchema.pre('save', function(next) {
    console.log('hashpassword', this);
    this.hashPassword();
    next();
  })

  var User = mongoose.model('User', userSchema);
  
module.exports = User;

