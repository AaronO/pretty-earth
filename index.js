// Requires
var fs = require('fs');
var path = require('path');
var request = require('request');
var base64 = require('base64');

// Globals
var OUT_DIR = path.join(__dirname, 'pictures');
var imageIds = require('./imageIds.json');


function writePhoto(photo) {
    var filename = [
        photo.geocode.country,
        photo.geocode.administrative_area_level_1,
        photo.id,
    ]
    .filter(Boolean)
    .map(function(str) {
        return str.replace(/S+/g, '-').toLowerCase();
    }).join('-') + '.jpg';

    var buffer = new Buffer(photo.dataUri.split(",")[1], 'base64');

    fs.writeFile(
        path.join(OUT_DIR, filename),
        buffer,
        function(err) {
            if(err) {
                console.error("Failed to write", photo.id, "because of", err);
            }
            console.log("Wrote", photo.id);
        }
    );
}

imageIds.forEach(function(id) {
    var url = "https://www.gstatic.com/prettyearth/"+id+".json";
    var options = {
        url: url,
        json: true,
    };
    request.get(options, function(err, body, parsed) {
        if(err) {
            console.error("Failed to get [", id, "] because of", err);
            return;
        }

        try {
            writePhoto(parsed);
        } catch(errx) {
            console.error("Failed to write [", id, "] because of", errx);
            return;
        }
    });
});
