var NotebookModel = require('./model');
var _ = require('lodash');

exports.params = function(req, res, next, id) {
  NotebookModel.findById(id)
    .populate('notes')
    .exec(function(err, notebook) {
      if (err) {
        next(err);
      } else if (!notebook) {
        next(new Error('Notebook not found'));
      } else {
        req.notebook = notebook;
        next();
      }
    });
};

exports.get = function(req, res, next) {
  NotebookModel.find({author: req.payload.username})
    .populate('notes')
    .exec(function(err, notebooks) {
      if (err) {
        next(err);
      } else {
        res.json(notebooks);
      }
    });
};

exports.post = function(req, res, next) {
  var notebook = new NotebookModel(req.body);
  notebook.author = req.payload.username;
  notebook.save(function(err, notebook) {
    if (err) {
      res.status(400).json({error: 'Notebook already exists'});
      next(err);
    } else {
      res.json(notebook);
    }
  });
};

exports.getOne = function(req, res) {
  res.json(req.notebook);
};

exports.put = function(req, res, next) {
  var notebook = req.notebook;
  var update = req.body;
  _.merge(notebook, update);
  notebook.save(function(err, notebook) {
    if (err) {
      next(err);
    } else {
      res.json(notebook);
    }
  });
};

exports.delete = function(req, res, next) {
  req.notebook.remove(function(err, notebook) {
    if (err) {
      next(err);
    } else {
      res.json(notebook);
    }
  });
};