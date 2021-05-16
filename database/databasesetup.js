var mysql = require('mysql');
const DatabaseCreds = require("./config.js");

class DatabaseConnection {

    constructor() {
        try {
            this.connection = mysql.createConnection(DatabaseCreds);
        } catch (e) {
            this.error = true;
            this.errormessage = message;
        }
        this.error = false;
    }


    InsertRecord(request, response, route) {
        var query = 'INSERT INTO configs SET ?';
        let configs = null;

        if (request && request.query && request.query.USERID && request.query.CONFIGNAME && request.query.JSONDATA)
            configs = {
                USERID: request.query.USERID,
                CONFIGNAME: request.query.CONFIGNAME,
                JSONDATA: request.query.JSONDATA
            }
        else {
            response.send(CompileError("invalid request", route));
            return;
        }

        this.connection.connect(function(err) {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            }
        });

        this.connection.query(query, configs, (err, res, fields) => {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            } else if (res.length === 0) {
                response.send(CompileError("No Configs Found", route));
                return;
            }
            response.send(CompileSuccess(res.insertId, query, route, 'InsertRecord'));
        });

        this.connection.end();
    }

    RetriveRecord(request, response, route) {
        const query = 'SELECT `ID`, `USERID`, `CONFIGNAME`, `JSONDATA`, `TMSTAMP` FROM `configs` WHERE ?';
        let configs = null;

        if (request && request.query &&
            request.query.USERID)
            configs = {
                USERID: request.query.USERID
            }
        else {
            response.send(CompileError("invalid request", route));
            return;
        }


        this.connection.connect(function(err) {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            }
        });

        this.connection.query(query, configs, (err, res, fields) => {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            } else if (res.length === 0) {
                response.send(CompileError("No Configs Found", route));
                return;
            }
            response.send(CompileSuccess(res, query, route, 'RetriveRecord'));
        });

        this.connection.end();
    }

    UpdateRecord(request, response, route) {
        const query = 'UPDATE configs SET ? WHERE ?';
        let configs = null;

        if (request && request.query && request.query.ID && request.query.JSONDATA)
            configs = [{ JSONDATA: request.query.JSONDATA },
                { ID: request.query.ID }
            ];
        else {
            response.send(CompileError("invalid request", route));
            return;
        }


        this.connection.connect(function(err) {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            }
        });

        this.connection.query(query, configs, (err, res, fields) => {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            } else if (res.length === 0) {
                response.send(CompileError("No Configs Found", route));
                return;
            }
            console.log(res);
            response.send(CompileSuccess(res, query, route, 'UpdateRecord'));
        });

        this.connection.end();
    }

    DeleteRecord(request, response, route) {
        const query = 'DELETE FROM `configs` WHERE ?';
        let configs = null;

        if (request && request.query && request.query.ID)
            configs = { ID: request.query.ID };
        else {
            response.send(CompileError("invalid request", route));
            return;
        }


        this.connection.connect(function(err) {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            }
        });

        this.connection.query(query, configs, (err, res, fields) => {
            if (err) {
                response.send(CompileError(err.code, route));
                return;
            } else if (res.length === 0) {
                response.send(CompileError("No Configs Found", route));
                return;
            }
            console.log(res);
            response.send(CompileSuccess(res, query, route, 'DeleteRecord'));
        });

        this.connection.end();
    }
}


function CompileError(err, route) {
    var errorjson = {
        timestamp: new Date().toISOString(),
        status: 500,
        error: "Internal Server Error ",
        message: err,
        "path": route
    }
    return (errorjson);
}

function CompileSuccess(data, req, route, calltype) {
    var errorjson = {
        timestamp: new Date().toISOString(),
        status: 200,
        success: true,
        message: calltype + " success",
        path: route,
        data: data,
        request: req
    }
    return (errorjson);
}


module.exports = function() {

    this.SetConfigData = function(request, response, route) {
        let con = new DatabaseConnection();
        if (!con.error)
            con.InsertRecord(request, response, route);
        else
            response.send(CompileError(con.errormessage, route))
    }

    this.GetConfigData = function(request, response, route) {
        let con = new DatabaseConnection();
        if (!con.error)
            con.RetriveRecord(request, response, route);
        else
            response.send(CompileError(con.errormessage, route))
    }

    this.UpdateConfigData = function(request, response, route) {
        let con = new DatabaseConnection();
        if (!con.error)
            con.UpdateRecord(request, response, route);
        else
            response.send(CompileError(con.errormessage, route))
    }

    this.DeleteConfigData = function(request, response, route) {
        let con = new DatabaseConnection();
        if (!con.error)
            con.DeleteRecord(request, response, route);
        else
            response.send(CompileError(con.errormessage, route))
    }
}