var app = require('../../server');
var request = require('supertest');
var expect = require('chai').expect;
var UserModel = require('../user/model');
var NotebookModel = require('../notebook/model');
var NoteModel = require('./model');
require('colors');

describe('[NOTES]'.bold.green, function() {
  var token;
  var userData = {
    username: 'test',
    password: 'test'
  };
  var notebook;
  var notebookData = {
    name: 'notebook one'
  };
  var note;
  var noteData = {
    title: 'note one title',
    content: 'note one content'
  };

  before(function(done) {
    UserModel.collection.drop();
    request(app)
      .post('/auth/register')
      .send(userData)
      .set('Accept', 'application/json')
      .end(function() {
        request(app)
          .post('/auth/login')
          .send(userData)
          .set('Accept', 'application/json')
          .end(function(err, res) {
            token = res.body.token;
            done();
          });
      });
  });

  beforeEach(function(done) {
    NotebookModel.collection.drop();
    NoteModel.collection.drop();

    request(app)
      .post('/notebooks')
      .send(notebookData)
      .set({Accept: 'application/json', Authorization: token})
      .end(function(err, res) {
        notebook = res.body;
        request(app)
          .post('/notebooks/' + notebook._id + '/notes')
          .send(noteData)
          .set({Accept: 'application/json', Authorization: token})
          .end(function(err, res) {
            note = res.body;
            done();
          });
      });
  });

  describe('#get()'.cyan, function() {
    it('should get all notes', function(done) {
      request(app)
        .get('/notebooks/' + notebook._id + '/notes')
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.eql(note);
          expect(res.body.length).to.eql(1);
          done();
        });
    });
  });

  describe('#post()'.cyan, function() {
    it('should create a new note', function(done) {
      request(app)
        .post('/notebooks/' + notebook._id + '/notes')
        .send(noteData)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('title', noteData.title);
          expect(res.body).to.have.property('content', noteData.content);
          done();
        });
    });
  });

  describe('#getOne()'.cyan, function() {
    it('should get a single note', function(done) {
      request(app)
        .get('/notebooks/' + notebook._id + '/notes/' + note._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(note);
          done();
        });
    });
  });

  describe('#put()'.cyan, function() {
    it('should update a specific note', function(done) {
      var update = {
        content: 'updated note one content'
      };
      request(app)
        .put('/notebooks/' + notebook._id + '/notes/' + note._id)
        .send(update)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('title', note.title);
          expect(res.body).to.have.property('content', update.content);
          done();
        });
    });
  });

  describe('#delete()'.cyan, function() {
    it('should delete a specific note', function(done) {
      request(app)
        .delete('/notebooks/' + notebook._id + '/notes/' + note._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(note);
          request(app)
            .get('/notebooks/' + notebook._id + '/notes')
            .set({Accept: 'application/json', Authorization: token})
            .end(function(err ,res) {
              expect(res.body.length).to.eql(0);
              done();
            });
        });
    });
  });
});