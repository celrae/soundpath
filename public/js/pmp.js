var PmpSdk = require('pmpsdk');
var sdk = new PmpSdk({client_id: '1', client_secret: '2', host: 'https://api.pmp.io'});

sdk.queryDocs({profile: 'story', text:('penmanship' OR 'term2')}, (doc, resp) {
  console.log(resp.status);          // 200
  console.log(resp.success);         // true
  console.log(query.items.length);   // 10
  console.log(query.total());        // 999
  console.log(query.items[0].attributes.title); // "Some doc title"
});