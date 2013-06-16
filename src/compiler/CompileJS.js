var outName = "../../js/app.js";
var fileArray = [
"../lib/jquery/jquery-1.7.js",
"../lib/jquery/jquery.mobile.js",
//"../lib/mobiscroll-2.5.4/mobiscroll.custom-2.5.4.min.js",
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
var compile = require("../lib/dot-packer/compilejs.js");
compile.compile(fileArray, outName);