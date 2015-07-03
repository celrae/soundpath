var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var pmp = require('../services/pmp');
var moment = require('moment-timezone');


/* GET home page. */
router.get('*',function (req, res, next) {
    var query = req.query;
    
    pmp.testSearch(query, function (err, results) {
        if (!results) {
            return res.send("");
        }
        
        var csv = 'title,created,duration,link\r\n';
        
        results.forEach(function (item) {
            item.items.forEach(function (subitem) {
                if (subitem.links && subitem.links.enclosure 
                    && subitem.links.enclosure[0] 
                    && subitem.links.enclosure[0].type 
                    && subitem.links.enclosure[0].type === "audio/m3u"
                    && subitem.links.enclosure[0].href
                    && subitem.links.enclosure[0].meta.duration) {
                        csv += '"' + item.attributes.title + '",' 
                            + moment(item.attributes.created).format("YYYY-MM-DD HH:mm:ssZ") + ',' 
                            + subitem.links.enclosure[0].meta.duration + ','
                            + subitem.links.enclosure[0].href + '\r\n';                              
                }
            });
        });
        
        res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Length': csv.length });
        res.end(csv);
    });
});


module.exports = router;
