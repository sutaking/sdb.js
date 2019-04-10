const bash = require('./src/bash'); 
const connect = require('./src/connect');


var Sdb = {
    bash,
    connect,
    /*launch,
    kill,
    installByWgt,
    installByTpk,
    installByAppId,
    getDebugPort,*/
};

Sdb.connect({
    ip:"109.123.121.94",
    user: "root",
    pwd: "tizen"
})
module.exports = Sdb;


