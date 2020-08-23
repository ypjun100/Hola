var express = require('express');
const { route } = require('./users');
var router = express.Router();

router.get('/test_page', function(req, res, next) {
  res.render('test_page')
});

router.get('/instruction', function(req, res, next) {
  res.render('instruction/index');
});

router.get('/instruction/ko', function(req, res, next) {
  res.render('instruction/ko');
});

router.get('/instruction/en', function(req, res, next) {
  res.render('instruction/en');
});

/* PC */
router.get('/', function(req, res, next) {
  res.render('desktop/login');
});

router.get('/people', function(req, res, next) {
  res.render('desktop/people');
});

router.get('/message', function(req, res, next) {
  res.render('desktop/message');
});

router.get('/information', function(req, res, next) {
  res.render('desktop/information');
});

router.get('/chat', function(req, res, next) {
  var id = req.query.id;
  res.render('desktop/chat', {id: id});
});

/* Mobile */
router.get('/m/', function(req, res, next) {
  res.render('mobile/login');
});

router.get('/m/people', function(req, res, next) {
  res.render('mobile/people');
});

router.get('/m/message', function(req, res, next) {
  res.render('mobile/message');
});

router.get('/m/information', function(req, res, next) {
  res.render('mobile/information');
});

router.get('/m/chat', function(req, res, next) {
  var id = req.query.id;
  res.render('mobile/chat', {id: id});
});

module.exports = router;
