﻿var outName = "../../js/lib/zepto.js";
var debug=false;
var fileArray = [
"../lib/zepto/zepto.js",
"../lib/zepto/touch.js",
"../lib/zepto/mobiscroll.zepto.js"
];
//read all view presenter 

///////////////////////////////////////////////////////////////////////////////
//begin compile
///////////////////////////////////////////////////////////////////////////////

var fs = require("fs");
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