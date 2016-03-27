var express = require('express');
var router = express.Router();
var controller = require('./controller');
var auth = require('../user/auth').auth();

router.param('notebook', controller.params);

router.route('/')
  .get(auth, controller.get)
  .post(auth, controller.post);

router.route('/:notebook')
  .get(auth, controller.getOne)
  .put(auth, controller.put)
  .delete(auth, controller.delete);

router.use('/:notebook/notes', require('../note/routes'));

module.exports = router;