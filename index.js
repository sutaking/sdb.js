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
    tv:"109.123.121.93",
    user: "root",
    pwd: "tizen",
    host: '109.123.121.146'
});

test.connect();
test.installByWgt('/home/zhaof/10.webDriver/3201701011486_1.0.2.wgt');
test.launch();



