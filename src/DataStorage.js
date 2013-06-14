/// <reference path="lib/android/cordova-2.6.0.js" />
/// <reference path="lib/zepto.js" />
/// <reference path="lib/Database.js" />
/// <reference path="Application.js" />

//interface SQLError {
//  const unsigned short UNKNOWN_ERR = 0;
//  const unsigned short DATABASE_ERR = 1;
//  const unsigned short VERSION_ERR = 2;
//  const unsigned short TOO_LARGE_ERR = 3;
//  const unsigned short QUOTA_ERR = 4;
//  const unsigned short SYNTAX_ERR = 5;
//  const unsigned short CONSTRAINT_ERR = 6;
//  const unsigned short TIMEOUT_ERR = 7;
//  readonly attribute unsigned short code;
//  readonly attribute DOMString message;
//};
//exception SQLException {
//  const unsigned short UNKNOWN_ERR = 0;
//  const unsigned short DATABASE_ERR = 1;
//  const unsigned short VERSION_ERR = 2;
//  const unsigned short TOO_LARGE_ERR = 3;
//  const unsigned short QUOTA_ERR = 4;
//  const unsigned short SYNTAX_ERR = 5;
//  const unsigned short CONSTRAINT_ERR = 6;
//  const unsigned short TIMEOUT_ERR = 7;
//  unsigned short code;
//  DOMString message;
//};
// interface  SQLResultSet {
//             readonly  attribute  long  insertId;
//             readonly  attribute  long  rowsAffected;
//             readonly  attribute  SQLResultSetRowList  rows;
//             };
//interface SQLResultSetRowList {
//  readonly attribute unsigned long length;
//  getter any item(in unsigned long index);
//};

(function () {
    var DataStorage = function () {
        var dbName = 'EloooDatabase', dbDesc = 'Eleooo.com for User Mobile', dbSize = 2 * 1024 * 1024;
        function openDb(fnAfterOpen) {
            try {
                if (!window.openDatabase) {
                    app.logError('Databases are not supported in this browser.');
                    return false;
                } else {
                    Database.logErrors = onExecuteError;
                    Database.openDatabase(dbName, '', dbDesc, dbSize, function () { initDatabase(fnAfterOpen) });
                    return true;
                }
            } catch (e) {
                if (e == 2) {
                    app.logError("Invalid database version.");
                } else {
                    app.logError("Unknown error " + e + ".");
                }
                return false;
            }
        }
        function initDatabase(fnAfterOpen) {
            var cmd = p.getCommand("Select count(*) as result from sqlite_master where name=? and type='table'", ['Orders'], function (tx, result, rows) {
                if (rows[0].result == 0) {
                    $.get("scripts/Sql.sql", function (sql) {
                        Database.putSelectResultsInArray = false;
                        Database.execute(sql, function () {
                            Database.putSelectResultsInArray = true;
                            if (fnAfterOpen)
                                fnAfterOpen();
                        });
                    });
                } else if (fnAfterOpen) {
                    fnAfterOpen();
                }
            });
            Database.execute([cmd]);
        }
        function onExecuteError(tx, err) {
            if (typeof (tx) == 'string')
                app.logError(tx);
            else if (err)
                app.logError(err);
        }
        function data(key, val) {
            if (val === undefined)
                return localStorage[key];
            else {
                return localStorage[key] = typeof (val) != "string" ? JSON.stringify(val) : val;
            }
        }
        return {
            initStorage: function (fnAfterOpen) {
                if (!Database.database)
                    openDb(fnAfterOpen);
            },
            getCommand: function (sql, params, onSuccess) {
                if ($.isFunction(params)) {
                    onSuccess = params;
                    params = [];
                }
                return { sql: sql, data: params || [], success: onSuccess };
            },
            execute: function (cmd, fnAfterExecute) {
                if ($.isArray(cmd) || typeof (cmd) == 'string')
                    Database.execute(cmd, fnAfterExecute);
                else
                    Database.execute([cmd], fnAfterExecute);
            },
            supportDatabase: function () {
                return $.isFunction(window.openDatabase);
            },
            WebAuthKey: function (key) {
                return data("EleoooWebAuthKey", key);
            },
            UserPhone: function (phoneNum) {
                return data("EleoooUserPhone", phoneNum);
            },
            UserPwd: function (pwd) {
                return data("EleoooUserPwd", pwd);
            },
            UserID: function (id) {
                return data("EleoooUserID", id);
            },
            CompanyID: function (id) {
                return data("EleoooCompanyID", id);
            },
            LatestUpdateOn: function (date) {
                return data("EleoooLatestUpdateOn", date);
            },
            Version: function (ver) {
                return data("EleoooVersion", ver);
            },
            IsSavePwd: function (state) {
                return data("EleoooIsSavePwd", state);
            },
            IsAutoLogin: function (state) {
                return data("EleoooIsAutoLogin", state);
            }
        };
    };
    window.DataStorage = DataStorage();
})(window);