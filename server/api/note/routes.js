var express = require('express');
var router = express.Router();
var controller = require('./controller');
var auth = require('../user/auth').auth();

router.param('note', controller.params);

router.route('/')
  .get(auth, controller.get)
  .post(auth, controller.post);

router.route('/:note')
  .get(auth, controller.getOne)
  .put(auth, controller.put)
  .delete(auth, controller.delete);

module.exports = router;