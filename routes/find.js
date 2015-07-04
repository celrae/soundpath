var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var moment = require('moment-timezone');

/* GET home page. */
router.get('*',function (req, res, next) {
    var query = req.query;
    
    search.find(query.keywords, { take: 1000, skip: 0, strict: true }, function (count, docs) {
        //var filteredArr = docs.filter(function (d) {
        //    return (JSON.stringify(d).indexOf(query.keywords) > 0);
        //});
        
        //if (filteredArr.length > 0) {
        //    docs = filteredArr;
        //}
        
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
