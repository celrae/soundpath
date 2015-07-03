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
        
        var csv = 'title,created,link,duration\r\n';

        
        var resp = "</br><b>title&nbsp;created&nbsp;duration&nbsp;link</b><hr>";
        results.forEach(function (item) {
            resp += item.attributes.title + '&nbsp;' + item.attributes.created + '&nbsp;';
            item.items.forEach(function (subitem) {
                if (subitem.links && subitem.links.enclosure 
                    && subitem.links.enclosure[0] 
                    && subitem.links.enclosure[0].type 
                    && subitem.links.enclosure[0].type === "audio/m3u") {
                        resp += '&nbsp;' + subitem.links.enclosure[0].meta.duration + "&nbsp;<a href='" + item.links.alternate[0].href + "'>" + item.attributes.title + "</a>";
                }
            });

            resp += "</br>";
        });
        
        return res.send(resp);
       //return res.render('stories', { list: results });
       //return res.json({ items: results });
    });
});


module.exports = router;
