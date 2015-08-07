var http = require('http');

module.exports = {
    getMP3: function (link, callback) {
        
        //build request parts from the existing link
        var addr = link.replace('http://', '');
        var hostname = addr.substr(0, addr.indexOf('/'));
        var path = addr.replace(hostname, '');
        
        //where we will store the response text (mp3 link)
        var body = "";
        
        //this requests the m3u file and parses the actual mp3 link we want
        http.get({ hostname: hostname, port: 80, path: path }, function (res) {
            res.on('data', function (data) {
                //gather pieces of response (sometimes it comes in chunks)
                body += data;
            });
            res.on('end', function () {
                //finished receiving response
                //body should be one mp3 link
                link = body;
                
                return callback(null, link);
            });
        }).on('error', function (e) {
            
            //skip, and try the next link
            return callback(e, link);
        });
    }
}