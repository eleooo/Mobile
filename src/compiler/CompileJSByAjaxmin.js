var outName = "../../js/app.js";
var fileArray = [
"../lib/jquery/jquery-1.7.js",
"../lib/jquery/jquery.mobile.js",
"../lib/mobiscroll-2.5.4/mobiscroll.custom-2.5.4.min.js",
"../lib/Common.js",
"../DataStorage.js",
"../EleoooWrapper.js",
"../Application.js"];
//read all view presenter 
var fs = require('fs');
var files = fs.readdirSync("../presenter");
for (i in files) {
    fileArray.push("../presenter/" + files[i]);
}


///////////////////////////////////////////////////////////////////////////////
//begin compile
///////////////////////////////////////////////////////////////////////////////

var fs = require("fs");
var exec = require("child_process").exec;
var commands = ["ajaxmin"];
commands.push("-comments:none");
for (var i = 0; i < fileArray.length; i++) {
    commands.push(fs.realpathSync(fileArray[i]));
}
if (outName) {
    commands.push("-out");
    commands.push(fs.realpathSync(outName));
}
outName = commands.join(" ");
console.log(outName);
exec(outName, { encoding: 'utf8', timeout: 1000000 }, function (error, stdout, stderr) {
    if (stdout)
        console.log('stdout: ' + stdout);
    if (stderr)
        console.log('stderr: ' + stderr);
});
