; (function () {
    Date.prototype.format = function (formatStr) {
        var str = formatStr;
        if (!formatStr) {
            str = "yyyy-MM-dd hh:mm:ss"; //默认格式
        }
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, this.getFullYear());
        str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
        str = str.replace(/MM/, this.getMonth() >= 9 ? (parseInt(this.getMonth()) + 1).toString() : '0' + (parseInt(this.getMonth()) + 1));
        str = str.replace(/M/g, (parseInt(this.getMonth()) + 1));
        str = str.replace(/w|W/g, Week[this.getDay()]);
        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
        str = str.replace(/d|D/g, this.getDate());
        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
        str = str.replace(/h|H/g, this.getHours());
        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
        str = str.replace(/m/g, this.getMinutes());

        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
        str = str.replace(/s|S/g, this.getSeconds());

        str = str.replace(/iii/g, this.getMilliseconds() < 10 ? '00' + this.getMilliseconds() : (this.getMilliseconds() < 100 ? '0' + this.getMilliseconds() : this.getMilliseconds()));

        return str;
    };
    String.prototype.endsWith = function (a) {
        return this.substr(this.length - a.length) === a;
    };
    String.prototype.startsWith = function (a) {
        return this.substr(0, a.length) === a;
    };
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };
    String.prototype.trimEnd = function () {
        return this.replace(/\s+$/, "");
    };
    String.prototype.trimStart = function () {
        return this.replace(/^\s+/, "");
    };
    Array.add = Array.enqueue = function (a, b) {
        a[a.length] = b;
    };
    Array.addRange = function (a, b) {
        a.push.apply(a, b);
    };
    Array.clear = function (a) {
        a.length = 0;
    };
    Array.clone = function (a) {
        if (a.length === 1) return [a[0]];
        else return Array.apply(null, a);
    };
    Array.contains = function (a, b) {
        return Array.indexOf(a, b) >= 0;
    };
    Array.dequeue = function (a) {
        return a.shift();
    };
    Array.indexOf = function (d, e, a) {
        if (typeof e === "undefined") return -1;
        var c = d.length;
        if (c !== 0) {
            a = a - 0;
            if (isNaN(a)) a = 0;
            else {
                if (isFinite(a)) a = a - a % 1;
                if (a < 0) a = Math.max(0, c + a)
            }
            for (var b = a; b < c; b++) if (typeof d[b] !== "undefined" && d[b] === e) return b;
        }
        return -1
    };
    Array.insert = function (a, b, c) {
        a.splice(b, 0, c);
    };
    Array.parse = function (value) {
        if (!value) return [];
        return eval(value);
    };
    Array.remove = function (b, c) {
        var a = Array.indexOf(b, c);
        if (a >= 0) b.splice(a, 1);
        return a >= 0;
    };
    Array.removeAt = function (a, b) {
        a.splice(b, 1);
    };
})(window);