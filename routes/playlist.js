var express = require('express');
var router = express.Router();
var pmp = require('../services/pmp');

/* GET home page. */
router.get('/search', function (req, res, next) {
    
    var text = req.query.search;

});



module.exports = router;



