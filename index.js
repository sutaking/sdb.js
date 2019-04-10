'use strict';

const Sdb = require('./src/sdb');
module.exports = Sdb;

/*var Sdb = {
    bash,
    connect,
    launch,
    kill,
    installByWgt,
    installByTpk,
    installByAppId,
    getDebugPort,
};*/

const cmd3 = "wascmd -l";

let test = new Sdb({
    tv:"109.123.121.94",
    user: "root",
    pwd: "tizen",
    host: '109.123.121.146'
});

test.connect();




