const spawn = require('cross-spawn');

const bash = (str, opt) => {

    let result = spawn.sync(str,!opt ? []: [opt]).stdout.toString().trim();

    console.log(
`*****************************************
${result}
*****************************************`);
};

module.exports = bash;