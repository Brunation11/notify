var NoteModel = require('./model');
var _ = require('lodash');

exports.params = function(req, res, next, id) {
  console.log("made it into params");
  NoteModel.findById(id, function(err, note) {
    if (err) {
      next(err);
    } else if (!note) {
      next(new Error("Note not found"));
    } else {
      req.note = note;
      next();
    }
  });
};

exports.get = function(req, res, next) {
  NoteModel.find({}, function(err, notes) {
    if (err) {
      next(err);
    } else {
      res.json(notes);
    }
  });
};

exports.getOne = function(req, res) {
  res.json(req.note);
};

exports.post = function(req, res, next) {
  var note = new NoteModel(req.body);
  note.save(function(err, note) {
    if (err) {
      next(err);
    } else {
      req.notebook.notes.push(note);
      req.notebook.save(function(err, notebook) {
        if (err) {
          console.log(err);
        } else {
          res.json(note);
        }
      });
    }
  });
};

exports.put = function(req, res, next) {
  var note = req.note;
  var update = req.body;
  _.merge(note, update);
  note.save(function(err, note) {
    if (err) {
      next(err);
    } else {
      res.json(note);
    }
  });
};

exports.delete = function(req, res, next) {
  req.note.remove(function(err, note) {
    if (err) {
      next(err);
    } else {
      res.json(note);
    }
  });
};