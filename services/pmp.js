﻿var PmpSdk = require('pmpsdk');

var sdk = new PmpSdk({ client_id: process.env.PMP_ID, client_secret: process.env.PMP_SECRET, host: 'https://api.pmp.io' });

module.exports = {
    search: function (terms, callback) {
        //"('penmanship' OR 'term2')"
        sdk.queryDocs({ profile: 'audio', text: '"'+ terms.toLowerCase() + '"' }, function (doc, resp) {
            
            console.log(resp.status);          // 200
            console.log(resp.success);         // true

            //console.log(query.items.length);   // 10
            //console.log(query.total());        // 999
            //console.log(query.items[0].attributes.title); // "Some doc title"
            
            if (resp.status === 404) {
                return callback(null);
            }
            return callback(null, doc.items);
        });
    }
}