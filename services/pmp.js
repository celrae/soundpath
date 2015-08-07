var PmpSdk = require('pmpsdk');
var moment = require('moment-timezone');
var fs = require('fs');

var sdk = new PmpSdk({ client_id: process.env.PMP_ID, client_secret: process.env.PMP_SECRET, host: 'https://api.pmp.io' });

module.exports = {
    search: function (terms, callback) {
        //"('penmanship' OR 'term2')"
        sdk.queryDocs({ profile: 'audio', text: '"'+ terms.toLowerCase() + '"' }, function (doc, resp) {
            
            console.log(resp.status);          // 200
            console.log(resp.success);         // true
            
            if (resp.status === 404) {
                return callback(null);
            }
            return callback(null, doc.items);
        });
    },

    testSearch: function (query, callback) {
        //"('penmanship' OR 'term2')"
        sdk.queryDocs(query, function (doc, resp) {

            console.log(resp.status);          // 200
            console.log(resp.success);         // true
            
            if (resp.status === 404) {
                return callback(null);
            }
            return callback(null, doc.items);
        });
    }
}