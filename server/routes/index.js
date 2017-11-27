const express = require('express');
const router = express.Router();

router.use('/', require('./preview'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/api/', require('./api/'));

module.exports = router;
