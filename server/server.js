var express = require('express');
var app = express();
var config = require('./config/config');
var logger = require('./util/logger');
var passport = require('passport');
var userRouter = require('./api/user/routes');
var notebookRouter = require('./api/notebook/routes');

require('mongoose').connect(process.env.MONGODB_URI);
require('./middleware/middleware')(app);
require('./api/user/auth');

app.use(passport.initialize());

app.get('/', function(req, res) {
  res.render('index');
});

app.use('/auth', userRouter);
app.use('/notebooks', notebookRouter);

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(400).send('Invalid token');
  } else {
    logger.error(err.stack);
  }
});

module.exports = app;