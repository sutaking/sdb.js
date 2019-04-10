// bash base on ssh
const bash = require('./bash');

// get sdb path
const sdbPath = require('./sdb');

const connect = ({ip, user, pwd}) => {

    const cmd1 = "vconftool set -t int db/sdk/develop/mode 1 -f";
    const cmd2 = "vconftool set -t string db/sdk/develop/ip 109.123.121.146 -f";
    const cmd3 = "wascmd -l";
    // Need 2 types of bash, ssh & sdb
    bash(`sshpass -p ${pwd} ssh ${user}@${ip} "${cmd2}"`);
    bash(`sshpass -p ${pwd} ssh ${user}@${ip} "${cmd3}"`);


}

module.exports = connect;
