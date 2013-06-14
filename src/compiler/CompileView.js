//#!/usr/bin/env node

///模板全局变量定义区域
var def = { appName: '乐多分商家管理系统' };

//生成配置
var ns = "VT";
var viewDir = "../../views/";
var outputFileName = "../../js/templates.js";
//模板变量定义结束

var dp = require("../lib/dot-packer/dot-packer.js");
dp.dotpacker(viewDir, outputFileName, ns, def);