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

/* GET home page. */
router.post('/testsearch', function (req, res, next) {
    var query = req.body;
    
    pmp.testSearch(query, function (err, results) {
        if (!results) {
            return res.json({});
        }
        
        //return res.render('stories', { list: results });
        //var results = [];
        //result.items.forEach(function (item) {
        //    var obj = {};
        //    for (var prop in item) {
        //        if (prop.indexOf('_') > -1) {
        //            continue;
        //        }
        //        obj[prop] = item[prop];
        //    }
        //    results.push(obj);
        //});
        
        var resp = "<hr>";
        results.forEach(function (item) { 

            resp += "<a href='" + item.links.alternate[0].href + "'>" + item.attributes.title + "</a></br>";
        });
        
        return res.send(resp);
       //return res.render('stories', { list: results });
       //return res.json({ items: results });
    });
});

module.exports = router;
