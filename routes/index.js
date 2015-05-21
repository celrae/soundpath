var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var pmp = require('../services/pmp');

/* GET home page. */
router.get('/search', function(req, res, next) {
    var text = req.query.search;

    pmp.search(text, function (err, results) {
        if (!results) {
            return res.json(null);
        }

        return res.render('stories', { list: results });
        //return res.json(results);
    });
});

module.exports = router;
