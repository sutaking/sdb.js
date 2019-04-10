'use strict';
const { execSync } = require('child_process');
const {sdbPath} = require('./utils');

class Sdb {
    constructor(config) {
        this.config = config;

        // remote path for webapp install on Tv.
        this.remotePath = '/opt/usr/home/';
        //console.log(sdbPath);
    }

    _setDevMode() {
        const {host} = this.config;
        const openMode = "vconftool set -t int db/sdk/develop/mode 1 -f";
        const setHost = `vconftool set -t string db/sdk/develop/ip ${host} -f`;

        this.bash(openMode);
        this.bash(setHost);
    }

    bash(cmd) {
        console.log(`[bash run]:${cmd}`);
        const { tv, user, pwd } = this.config;

        let execStr = `sshpass -p ${pwd} ssh ${user}@${tv} "${cmd}"`;

        this._exec(execStr);
    }

    _exec(cmd) {
        let result;
        try {
            result = execSync(cmd);
            if (result.length > 0) {
                
                console.log(
                    `
******************* Log Info **********************
${result.toString().trim()}
********************** End ************************
`);
                return result.toString().trim();
            } else {
                console.log(`${Date()}[Excute Success]`)
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    runCli(cmd) {
        

        console.log(`runCli: [${sdbPath} ${cmd}]`);

        this._exec(`${sdbPath} ${cmd}`);
    }

    connect() {
        //this._setDevMode();
        const {tv} = this.config;

        this.runCli('kill-server');
        this.runCli('start-server');

        this.runCli('disconnect');
        this.runCli(`connect ${tv}:26101`);
        this.runCli('devices');

        this.runCli(`-s ${tv} root on`);
        //var SDB_COMMAND_ROOT = 'root on';
    }


    launch() {

    }
    kill() {

    }
    installByWgt(wgtPath) {
        const {tv} = this.config;
        
        //var pushCommand = SDB_PATH + SPACE + SDB_OPT_SERIAL + SPACE + SDB_COMMAND_PUSH + SPACE + localPath + SPACE + remotePath;
        this.runCli(`-s ${tv} push ${wgtPath} ${this.remotePath}`);
    }
    installByTpk() {

    }
    installByAppId() {

    }
    getDebugPort() {

    }

}

module.exports = Sdb;