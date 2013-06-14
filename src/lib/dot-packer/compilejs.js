var fs = require('fs');
var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
function compileProcess(fileArray, outFileName) {
    try {
        var codes = [];
        for (var i = 0; i < fileArray.length; i++) {
            if (fileArray[i] && fileArray[i].length > 0) {
                console.log("process " + fileArray[i]);
                var code = readFileData(fileArray[i]);
                pushCode(codes, code);
                //codes.push(fs.realpathSync(fileArray[i]));
            }
        }
        if (codes.length > 0) {
            fs.writeFileSync(outFileName, codes.join('\r\n'), 'utf8');
        }
    } catch (err) {
        dumpError(err);
    }
}
function readFileData(fileName) {
    var path = fileName;
    var data = fs.readFileSync(path, 'utf8');
    return data;
}
function pushCode(dataArray, code) {
    var ast = jsp.parse(code); // parse code and get the initial AST
    ast = pro.ast_mangle(ast); // get a new AST with mangled names
    ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
    var final_code = pro.gen_code(ast); // compressed code here
    dataArray.push(final_code);
}
function dumpError(err) {
    if (typeof err === 'object') {
        if (err.message) {
            console.log('\nMessage: ' + err.message)
        }
        if (err.stack) {
            console.log('\nStacktrace:')
            console.log('====================')
            console.log(err.stack);
        }
    } else {
        console.log('dumpError :: argument is not an object');
    }
}

module.exports.compile = compileProcess;