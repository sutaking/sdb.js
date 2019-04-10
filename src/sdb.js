'use strict';
const { execSync } = require('child_process');
const {sdbPath} = require('./utils');

class Sdb {
    constructor(config) {
        this.config = config;
        console.log(sdbPath);
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

        let result;
        try {
            result = execSync(execStr);
            if (result.length > 0) {
                console.log(
                    `*****************************************
${result.toString().trim()}
*****************************************`);
            } else {
                console.log(`[bash Excute Success] No Log Output ~~~~`)
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    _exec() {

    }

    connect() {
        //this._setDevMode();
    }


    launch() {

    }
    kill() {

    }
    installByWgt() {

    }
    installByTpk() {

    }
    installByAppId() {

    }
    getDebugPort() {

    }

}

module.exports = Sdb;