
var crypto = require('crypto');
var mongoose = require('mongoose');

  //add functions
  var Schema = mongoose.Schema;
  var urlSchema = new Schema ({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: {
      type: Number,
      default: 0
    }
  }, {
    timestamps: true
  });
  
  var Link = mongoose.model('Link', urlSchema);

  urlSchema.pre('save', function(next) {
    var shasum = crypto.createHash('sha1');
    shasum.update(this.url);
    this.code = shasum.digest('hex').slice(0, 5);
    next();
  });

  

module.exports = Link;
