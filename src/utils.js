'use strict';
const path = require('path');
const { execSync } = require('child_process');

let CLI_NAME = (process.platform == 'win32') ? 'sdb.exe' : 'sdb';
let CLI_FOLDER = (process.platform == 'win32') ? 'win' : (process.platform == 'linux') ? 'linux' : 'mac';

const sdbPath = path.normalize(`${__dirname}/cli/${CLI_FOLDER}/${CLI_NAME}`);

if (process.platform !== "win32") {
    console.log(`Not window platfrom need init sdb shell`);
    execSync(`chmod +x ${sdbPath}`);
}

//console.log(`sdbPath ------> ${sdbPath}`);

module.exports = { sdbPath };