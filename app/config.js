var Bookshelf = require('bookshelf');
var path = require('path');
var environment = process.env.NODE_ENV || 'development';
var mongoose = require('mongoose');
var db;

if (environment === 'development') {
  db = Bookshelf.initialize({
    client: 'sqlite3',
    connection: {
      host: '127.0.0.1',
      user: 'your_database_user',
      password: 'password',
      database: 'shortlydb',
      charset: 'utf8',
      filename: path.join(__dirname, '../db/shortly.sqlite')
    }
  });

  db.knex.schema.hasTable('urls').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('urls', function (link) {
        link.increments('id').primary();
        link.string('url', 255);
        link.string('base_url', 255);
        link.string('code', 100);
        link.string('title', 255);
        link.integer('visits');
        link.timestamps();
      }).then(function (table) {
        console.log('Created Table', table);
      });
    }
  });

  db.knex.schema.hasTable('users').then(function(exists) {
    if (!exists) {
      db.knex.schema.createTable('users', function (user) {
        user.increments('id').primary();
        user.string('username', 100).unique();
        user.string('password', 100);
        user.timestamps();
      }).then(function (table) {
        console.log('Created Table', table);
      });
    }
  });
}

else {
  var Schema = mongoose.schema;

  // moongoose.connect('127.0.0.1:1337');
  mongoose.connect('mongodb://localhost/myapp');

  db = {};

  // Defining schema
  db.userSchema = new Schema({
    username : String,
    password : String,   
  }, { 
    timestamps: true 
  });

  db.urlSchema = new Schema ({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visit: Number
  }, {
    timestamps: true
  });

  //Attach schema to model
  // var user = mongoose.model('User', userSchema);
  // var url = mongoose.model('Url', urlSchema);

}

module.exports = db;