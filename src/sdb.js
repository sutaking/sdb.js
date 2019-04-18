'use strict';
const { execSync } = require('child_process');
const crossSpawn = require('cross-spawn');
const path = require('path');

const { sdbPath } = require('./utils');
const keyMaps = require('./keymaps');

class Sdb {
    constructor(config) {
        this.config = config;
        this.serPort = 26101;
        this.appName = !config.appTizenId ? 'testApp' : config.appTizenId;

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

        let execStr = `sshpass -p ${pwd} ssh -o StrictHostKeyChecking=no ${user}@${tv} ${cmd}`;

        this._exec(execStr);
    }

    _exec(cmd) {
        let result;
        try {
            result = execSync(cmd);
            if (result.length > 0) {
                let _log = result.toString().trim();
                console.log(
                    `
******************* Log Info **********************
${_log}
********************** End ************************
`);
                return _log;
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

        return this._exec(`${sdbPath} ${cmd}`);
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
        return this.runCli(`-s ${tv} shell ${cmd}`);
    }

    connect() {
        this._setDevMode();
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
    launch() {
        this.sdbShell(`wascmd -r ${this.appName}`);
    }
    kill() {
        this.sdbShell(`wascmd -t ${this.appName}`);
    }
    uninstall() {
        this.sdbShell(`wascmd -u ${this.appName}`);
    }
    installByFile(wgtPath, name) {
        const wgtName = path.basename(wgtPath);
        if (name && name.length > 0) {
            this.appName = name;
        }

        this.push(wgtPath, this.remotePath, wgtName);

        const tvPath = `${this.remotePath}${wgtName}`;
        this.uninstall();
        this.sdbShell(`wascmd -i ${this.appName} -p ${tvPath}`);
    }
    installByAppId(appId) {
        this.sdbShell(`wascmd -i ${appId}`);
    }
    launchDebug() {

        this.kill();

        let info = this.sdbShell(`app_launcher -d -w -s ${this.appName}`);
        let debugInfo = {};
        let pid_index = info.toString().search("pid =");
        let with_index = info.toString().search("with");
        if (pid_index != -1 && with_index != -1) {
            debugInfo.pid = info.toString().substring(pid_index + 6, with_index - 1);
        }

        let port_index = info.toString().search("port:");
        if (port_index != -1) {
            debugInfo.port = info.toString().substring(port_index + 6);
        }
        console.log(JSON.stringify(debugInfo));
        return debugInfo;
    }
    triggerRemoteController(key) {
        if (key.length <= 0) return;        
        console.log(`Receive Keycode: ${key}`);

        this.sdbShell(`vk_send ${keyMaps[key]}`);
    }
    tvLog(key) {
        const { tv, user, pwd } = this.config;

        let log = crossSpawn('sshpass', ['-p', pwd, 'ssh', '-o', 'StrictHostKeyChecking=no', `${user}@${tv}`, 'dlogutil', key]);

        log.stdout.on('data', function (data) {
            console.log('stdout: ' + data.toString());
        });
        log.stderr.on('data', function (data) {
            console.log('stderr: ' + data.toString());
        });

        log.on('exit', function (code) {
            console.log('child process exited with code ' + code.toString());
        });
    }

}

module.exports = Sdb;