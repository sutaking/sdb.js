'use strict';
const { execSync } = require('child_process');
const path = require('path');

const { sdbPath } = require('./utils');

class Sdb {
    constructor(config) {
        this.config = config;
        this.serPort = 26101;

        // remote path for webapp install on Tv.
        this.remotePath = '/opt/usr/home/';

        //console.log(sdbPath);
    }

    _setDevMode() {
        const { host } = this.config;
        const openMode = "vconftool set -t int db/sdk/develop/mode 1 -f";
        const setHost = `vconftool set -t string db/sdk/develop/ip ${host} -f`;

        this.bash(openMode);
        this.bash(setHost);
    }

    bash(cmd) {
        if (!cmd) {
            return console.error('Empty Command! Please check your input');
        }
        console.log('Sdb.js Need Install sshpass first.');

        console.log(`[Exec Bash]:${cmd}`);
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
        if (!cmd) {
            return console.error('Empty Command! Please check your input');
        }

        console.log(`Exec: [${sdbPath} ${cmd}]`);

        this._exec(`${sdbPath} ${cmd}`);
    }

    _restartServer() {
        this.runCli('kill-server');
        this.runCli('start-server');
    }
    _switchRoot() {
        this.runCli(`-s ${this.config.tv} root on`);
    }
    sdbShell(cmd) {
        const { tv } = this.config;
        this.runCli(`-s ${tv} shell ${cmd}`);
    }

    connect() {
        //this._setDevMode();
        this._restartServer();

        this.runCli('disconnect');
        this.runCli(`connect ${this.config.tv}:${this.serPort}`);
        this.runCli('devices');

        this._switchRoot();
    }
    push(file, dst, name) {
        // Need Del first before
        this.sdbShell(`rm -rf ${dst}${name}`);

        // Push New file to remote
        this.runCli(`-s ${this.config.tv} push ${file} ${dst}`);
    }
    launch(appName) {
        if (!appName) {
            return console.error('Can not launch App without App ID');
        }
        this.sdbShell(`wascmd -r ${appName}`);
    }
    kill(appName) {
        this.sdbShell(`wascmd -r ${appName}`);
    }
    uninstall(appName) {
        this.sdbShell(`wascmd -u ${appName}`);
    }
    installByFile(wgtPath, appName) {
        const wgtName = path.basename(wgtPath);

        this.push(wgtPath, this.remotePath, wgtName);

        const tvPath = `${this.remotePath}${wgtName}`;
        this.uninstall(appName);
        this.sdbShell(`wascmd -i ${appName} -p ${tvPath}`);
    }
    installByAppId(appId) {
        this.sdbShell(`wascmd -i ${appId}`);
    }
    getDebugPort() {

    }

}

module.exports = Sdb;