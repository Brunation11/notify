var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotebookSchema = new Schema({
  name: {
    type: String,
    require: true,
    unique: true
  },
  author: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note'
    }
  ]
});

module.exports = mongoose.model('Notebook', NotebookSchema);