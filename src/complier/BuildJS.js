﻿﻿var outName = "../../js/application.js";
var debug=false;
var fileArray = [
//"../lib/jquery/jquery-1.7.js",
//"../lib/jquery/jquery.mobile.js",
//"../lib/mobiscroll-2.5.4/mobiscroll.custom-2.5.4.min.js",
"../Common.js",
"../DataStorage.js",
"../EleoooWrapper.js",
"../WebPusher.js",
"../Application.js"];
//read all view presenter 
var fs = require('fs');
var files = fs.readdirSync("../presenter");
for (i in files) {
    fileArray.push("../presenter/"+  files[i]);
}


///////////////////////////////////////////////////////////////////////////////
//begin compile
///////////////////////////////////////////////////////////////////////////////

if(debug){
    var data = '',i;
    for(i=0;i<fileArray.length;i++){
        data = data + fs.readFileSync(fileArray[i], 'utf8').replace(/^\s+|\s+$/g, "") +'\r\n';
    }
    fs.writeFileSync(outName, data, 'utf8');
    console.log("build completed");
}else{
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
        if (stdout){
                console.log('stdout: --------------------------------');
                console.log(stdout);
            }

        if (stderr){
            console.log('stderr: -------------------------------------');
            console.log(stderr);
        }
    });
}