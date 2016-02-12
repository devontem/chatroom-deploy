var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
// var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req,  res) {
 Link.find({}, function(err, links) {
    res.send(200, links);
  });  
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ 'url': uri }, function(err, link){
    if (link){
      res.send(200, link);
    } 
    else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        Link.create({ url: uri, title: title, base_url: req.headers.origin }, function(err, link){
          res.send(200, link);
        });
      });
    }
  
  });

};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  

  User.findOne({'username': username}, function(err, user) {
    if(!user) { //if username does not exist, redirect to login
      res.redirect('/login');
    }
    
    else { //if username exists within DB, commpare the password
      var savedPassword = user.password; 
      User.comparePassword(password, savedPassword, function(match) {
        if(match) {
          util.createSession(req, res, user);
        }
        else {
          res.redirect('/login');
        }
      })
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({'username' : username}, function(err, userid) {
    if(!userid) {
      User.create({'username': username, 'password': password}, function(err, user) {
        util.createSession(req, res, user);
      });

    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    } 
  });

};

exports.navToLink = function(req, res) {

  Link.findOne({code: req.params[0]}, function(err, link){
    if (!link){
      res.redirect('/');
    } else {
      link.visits++;

      link.save(function(err){
        if (err) { throw err; }

        return res.redirect(link.url)
      });
    }
  })
};