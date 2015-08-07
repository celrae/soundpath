var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var pmp = require('../services/pmp');
var moment = require('moment-timezone');
var async = require('async');
var PmpSdk = require('pmpsdk');
var m3uParser = require('../services/m3u.js');
var fulltext = require('../services/fulltext.js');
var textsearch = fulltext.load('pmp', 'search');

var pmpsdk = new PmpSdk({ client_id: process.env.PMP_ID, client_secret: process.env.PMP_SECRET, host: 'https://api.pmp.io' });

/* PMP Search */
router.post('/pmp', function (req, res, next) {
    var query = req.body;
    
    //query the pmp sdk
    pmpsdk.queryDocs(query, function (doc, resp) {
        
        if (resp.status === 404 || !doc.items) {
            return res.render('nostory');
        }

        var audioLinks = [];
        
        //for each result
        async.eachSeries(doc.items, function (item, cb) {

            //extract the required data from the result list
            //only results with audio are used
            item.items.forEach(function (subitem) {
                if (subitem.links && subitem.links.enclosure 
                    && subitem.links.enclosure[0] 
                    && subitem.links.enclosure[0].type 
                    && (subitem.links.enclosure[0].type === "audio/m3u" || subitem.links.enclosure[0].type === "audio/mpeg") 
                    && subitem.links.enclosure[0].href 
                    && subitem.links.enclosure[0].meta.duration) {
                    
                    audioLinks.push({ title: item.attributes.title, type: subitem.links.enclosure[0].type, href: subitem.links.enclosure[0].href });
                }
            });
            
            //extract from the next link
            //or continue to the next step when finished
            return cb();

        }, function (e) {
            //next step:
            //Created list of audio links and stored in audioLinks array
            //Now pull mp3 out of the m3u if necessary
            async.eachSeries(audioLinks, function (subitem, cb) {
                if (subitem.type != "audio/m3u") {
                    return cb();
                }
                
                m3uParser.getMP3(subitem.href, function (e, link) {
                    subitem.href = link || subitem.href;

                    //do this again for the next link
                    //or if finished, continue to the next step 
                    return cb();
                });

            }, function (e) {
                //next step:
                //finished getting mp3 data
                //now build and render the response view html              
                return res.render('results', { list: audioLinks });
            });
        });
    });
});


/* full text search 
 * 
 */
router.get('/fulltext', function (req, res, next) {
    var query = req.query;
    
    search.find(query.keywords, { take: 1000, skip: 0, strict: true }, function (count, docs) {
        
        docs.sort(function (a, b) {
            if (JSON.stringify(a).indexOf(search) > 0 && JSON.stringify(b).indexOf(search) < 0) {
                return 1;
            } else if (JSON.stringify(b).indexOf(search) > 0 && JSON.stringify(a).indexOf(search) < 0) {
                return 0;
            }
        });
        
        res.send(docs);
    });
});


module.exports = router;
