var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var moment = require('moment-timezone');

/* GET home page. */
router.get('*',function (req, res, next) {
    var query = req.query;
    
    search.find(query.keywords, { take: 1000, skip: 0, strict: true }, function (count, docs) {
        var results = '';
        docs.forEach(function (doc) {
            results += (results != '' ? ',' : '') + JSON.stringify(doc);
        });
        
        res.writeHead(200, { 'Content-Type': 'text/json' });
        return res.end('[' + results + ']');
    });	  
});


module.exports = router;
