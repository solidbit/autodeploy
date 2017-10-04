var express = require('express');
var router = express.Router();

router.use('/git', require('./git'));

module.exports = router;
