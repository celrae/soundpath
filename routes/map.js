var express = require('express');
var router = express.Router();
var http = require('http');
var async = require('async');


var bingKey = "AooV_1M7YzowKwK2I5etnbasj5xP62IeIO_7NpaUOt2AFZpGZdERCWPMPOK8_R-9";
var bingHost = "dev.virtualearth.net";
var routePath = "/REST/V1/Routes/Driving";
var locationPath = "/REST/V1/Locations";

/* GET home page. */
router.post('/route', function (req, res, next) {

    var query = '?wp.0=' + encodeURIComponent(req.body.from) 
         + '&wp.1=' + encodeURIComponent(req.body.to) 
         + '&routeAttributes=routePath' 
         //+ '&tl=0.00001'
         + '&key=' + encodeURIComponent(bingKey);
    
    var resp = "";

    http.get({ hostname: bingHost, port: 80, path: routePath + query }, function (response) {
        response.on('data', function (data) {
            resp += data;
        });
        response.on('end', function (e) {
            if (e) {
                return res.error(e);
            }
            return res.json(JSON.parse(resp));
        });
    }).on('error', function (e) {
        return res.error(e);
    });
});


/* GET home page. */
router.post('/locality', function (req, res, next) {
    
    var query = '/' + req.body.lat + ',' + req.body.long
         //+ '?includeEntityTypes=populatedPlace' 
         + '?key=' + encodeURIComponent(bingKey);
    
    var resp = "";
    
    http.get({ hostname: bingHost, port: 80, path: locationPath + query }, function (response) {
        response.on('data', function (data) {
            resp += data;
        });
        response.on('end', function (e) {
            if (e) {
                return res.error(e);
            }
            return res.json(JSON.parse(resp));
        });
    }).on('error', function (e) {
        return res.error(e);
    });
});

module.exports = router;
