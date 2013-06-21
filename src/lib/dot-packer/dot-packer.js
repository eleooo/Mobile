var fs = require('fs');
var dot = require('dot');

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
function dotpacker(viewDir, outputFileName, ns, def) {
    try {

        var code = "var " + ns + " = function(){ return new Function();};";
        var file = null;
        var files = fs.readdirSync(viewDir);
        for (i in files) {
            if (files[i].match(/^[^\.]*\.html/g)) {
                console.log("Processing:" + files[i]);
                code += convert(files[i], ns); ;
            }
        }

        var ast = jsp.parse(code); // parse code and get the initial AST
        ast = pro.ast_mangle(ast); // get a new AST with mangled names
        ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
        var final_code = pro.gen_code(ast); // compressed code here
        //console.log(final_code);
        fs.writeFileSync(outputFileName, final_code, 'utf8');
    }

    catch (err) {
        dumpError(err);
    }
    
    function convert(fileName, namespace) {
        var path = viewDir + fileName;
        var data = fs.readFileSync(path, 'utf8').replace(/^\s+|\s+$/g, "");
        var code = dot.template(data,undefined,def).toString();
        var header = namespace + "['" + ucfirst(fileName.replace('.html', '')) + "'] = function(it)";
        code = code.replace('function anonymous(it)', header) + ";";
        return code;
    }

    function ucfirst(str) {
        var s = str.charAt(0);
        str = str.replace(s, s.toUpperCase());
        return str;
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
}

module.exports.dotpacker = dotpacker;
