'use strict';
const path = require('path');

let CLI_NAME = (process.platform == 'win32') ? 'sdb.exe' : 'sdb';
let CLI_FOLDER = (process.platform == 'win32') ? 'win' : (process.platform == 'linux') ? 'linux' : 'mac';

const sdbPath = path.normalize(`${__dirname}/sdb/${CLI_FOLDER}/${CLI_NAME}`);


module.exports = { sdbPath };