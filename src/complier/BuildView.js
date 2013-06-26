﻿///模板全局变量定义区域
var def = { appName: '乐多分商家管理系统' };

//生成配置
var ns = "VT";
var viewDir = "../../views/";
var outputFileName = "../../js/templates.js";
//模板变量定义结束

var dp = require("../lib/dot-packer/dot-packer.js");
dp.dotpacker(viewDir, outputFileName, ns, def);
//return;
//var fs = require('fs');
//outputFileName = fs.realpathSync(outputFileName);
//var exec = require("child_process").exec;
//var commands = ["ajaxmin"];
//commands.push("-comments:none");
//commands.push(outputFileName);
//commands.push("-out");
//commands.push(outputFileName);

//var outName = commands.join(" ");
//console.log(outName);
//exec(outName, { encoding: 'utf8', timeout: 1000000 }, function (error, stdout, stderr) {
//    if (stdout){
//            console.log('stdout: --------------------------------');
//            console.log(stdout);
//        }

//    if (stderr){
//        console.log('stderr: -------------------------------------');
//        console.log(stderr);
//    }
//}); 