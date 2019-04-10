const spawn = require('cross-spawn');
const { execSync, exec } = require('child_process');

const bash = (str, opt) => {

    console.log(`[bash run]:${str}`);

    //let result = spawn.sync(str, !opt ? []: [opt]).stdout;
    let result;
    try {
        result = execSync(str);
        if (result.length > 0) {
            console.log(
                `*****************************************
${result.toString().trim()}
*****************************************`);                
        } else {
            console.log(`[] Excute Success! No log ouput~~~~`)
        }
    } catch (error) {
        console.error(error.message);
    }

}; 

module.exports = bash;