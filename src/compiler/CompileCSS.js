var outName = "../../css/style.css";
var fileArray = [
"../../css/Global.css",
"../../css/eleoooMobile.css",
"../lib/mobiscroll-2.5.4/css/mobiscroll.custom-2.5.4.min.css"];
//read all view presenter



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