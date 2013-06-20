var PORT = 8081;
var rootDir = "../";
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var querystring = require("querystring");

var types = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "htm": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

function outLog(uri, request, response) {
    if (uri.query) {
        var data = querystring.parse(uri.query);
        console.log("-------------" + JSON.stringify(new Date()).replace(/\"/g,'') + "--------------");
        for (var d in data) {
            console.log(d + ":" + data[d]);
        }
    } else {
        console.log("unkown info");
    }
    response.end("okay");
}

function outPathContent(ext, pathname, request, response) {
    ext = ext ? ext.slice(1) : "unknown";

    fs.realpath(rootDir + pathname, function (err, realPath) {
        if (err) {
            response.writeHead(404, {
                "Content-Type": "text/plain"
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        "Content-Type": "text/plain"
                    });
                    console.log(err);
                    response.end(err);
                } else {
                    var contentType = types[ext] || "text/plain";
                    response.writeHead(200, {
                        "Content-Type": contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}

var server = http.createServer(function (request, response) {
    var uri = url.parse(request.url);
    var pathname = uri.pathname;
    var ext = path.extname(uri.pathname) || (uri.pathname == '/' && !uri.query ? (pathname = 'index.htm', '.html') : '');
    if (ext)
        outPathContent(ext, pathname, request, response);
    else
        outLog(uri, request, response);
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");