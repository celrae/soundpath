var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var pmp = require('../services/pmp');
var moment = require('moment-timezone');

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
        
        
        var resp = '<table cellspacing="5"><th><tr><td>title</td><td>created</td><td>duration</td><td>link</td></tr></th><tbody>';
        results.forEach(function (item) {

            item.items.forEach(function (subitem) {
                if (subitem.links && subitem.links.enclosure 
                    && subitem.links.enclosure[0] 
                    && subitem.links.enclosure[0].type 
                    && subitem.links.enclosure[0].type === "audio/m3u" 
                    && subitem.links.enclosure[0].href 
                    && subitem.links.enclosure[0].meta.duration) {
                    resp += '<tr><td>' + item.attributes.title  
                         + '</td><td>' + moment(item.attributes.created).format("YYYY-MM-DD HH:mm:ssZ") 
                         + '</td><td>' + subitem.links.enclosure[0].meta.duration 
                         + "</td><td><a href='" + item.links.alternate[0].href + "'>" + item.attributes.title + "</a></td></tr>";
                }
            });
        });
        
        resp += "</tbody></table>";
        
        return res.send(resp);
       //return res.render('stories', { list: results });
       //return res.json({ items: results });
    });
});


module.exports = router;
