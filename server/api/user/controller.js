var UserModel = require('./model');
var passport = require('passport');

exports.register = function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({error: 'Please fill out all fields correctly'});
  }
  var user = new UserModel();
  user.username = req.body.username;
  user.setPassword(req.body.password);
  user.save(function(err, user) {
    if (err) {
      res.status(400).json({error: 'Username already in use'});
      next(err);
    } else {
      res.json({token: user.generateJWT()});
    }
  });
};

exports.login = function(req, res, next) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({error: 'Please fill out all fields correctly'});
  }
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      res.status(400).json({error: err});
      next(err);
    } else if (user) {
      res.json({token: user.generateJWT()});
    } else {
      res.status(401).json({error: info});
    }
  })(req, res, next);
}