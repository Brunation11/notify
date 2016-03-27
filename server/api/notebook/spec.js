var app = require('../../server');
var request = require('supertest');
var expect = require('chai').expect;
var UserModel = require('../user/model');
var NotebookModel = require('./model');
require('colors');

describe('[NOTEBOOKS]'.bold.green, function() {
  var token;
  var userData = {
    username: 'test',
    password: 'test'
  };
  var notebook;
  var notebookData = {
    name: 'test'
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
    request(app)
      .post('/notebooks')
      .send(notebookData)
      .set({Accept: 'application/json', Authorization: token})
      .end(function(err, res) {
        notebook = res.body;
        done();
      });
  });

  describe('#get()'.cyan, function() {
    it('should get all notebooks', function(done) {
      request(app)
        .get('/notebooks')
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.eql(1);
          expect(res.body[0]).to.eql(notebook);
          done();
        });
    });
  });

  describe('#post()'.cyan, function() {
    it('should create a new notebook', function(done) {
      request(app)
        .post('/notebooks')
        .send(notebookData)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('name', notebookData.name);
          done();
        });
    });
  });

  describe('#getOne()'.cyan, function() {
    it('should get a single notebook', function(done) {
      request(app)
        .get('/notebooks/' + notebook._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(notebook);
          done();
        });
    });
  });

  describe('#put()'.cyan, function() {
    it('should update a specific notebook', function(done) {
      var update = {
        name: 'updated test'
      };
      request(app)
        .put('/notebooks/' + notebook._id)
        .send(update)
        .set({'Accept': 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.have.property('name', update.name);
          done();
        });
    });
  });

  describe('#delete()'.cyan, function() {
    it('should delete a specific notebook', function(done) {
      request(app)
        .delete('/notebooks/' + notebook._id)
        .set({Accept: 'application/json', Authorization: token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          expect(res.body).to.eql(notebook);
          request(app)
            .get('/notebooks')
            .set({'Accept': 'application/json', Authorization: token})
            .end(function(err, res) {
              expect(res.body.length).to.eql(0);
              done();
            });
        });
    });
  });
});