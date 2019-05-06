# Sdb.js

Based on Tizen WebApp SDB Command Line Devtools. You can use these npm package to install/uninstall your app by javascirpt.

Sdb.js support .wgt & .tpk Tizen App.

Sdb.js only support network connect, not support serial connect. So you need open ssh server on your tv or emulator first. If not, Sdb.js can not work. 

## Installation

Need install sshpass first:
````
$ npm install git+https://git@github.com/sutaking/sdb.js.git#master

// If you donot know how to open debug mode of tv, you can try these.
// sdb.js will try open it with shell.
$ sudo apt-get install sshpass
````

## Usage
How to install/uninstall your app to Tizen TV.
````javascript

let tv = new Sdb({
    // these opts are required
    tv:"192.168.121.93",
    user: "root", // ssh accout
    pwd: "123456", // ssh pwd
    host: '192.168.121.146',// your ssh host device ip.

    // Not required, if you want named your app on tv, you need use it.
    // if not, sdb.js will named defualt as 'testApp'
    // Have a unique name to your app, it will be help for 'ps -ef|grep xxx' to check usage of cpu & memory.
    appUUid: '3201701011486',
    appTizenId: 'zcwsruDJBm.CAPHTESTSUITEANGULAR'
});

// Step 1. start connect tv
tv.connect();

// Step 2. install your app
tv.installByFile('/home/zhaof/10.webDriver/3201701011486_1.0.2.wgt');

// you can also install app by uuid, if your app already upload to Samsung Store.
tv.installByAppId('3201701011486');

// Step 3. launch your app on Tv
tv.launch();

// Step 4. Termination your app
// If you want launch your app again, you can call launch().
tv.kill()

// Step 5. Uninstall your app on Tv
tv.uninstall();

// You also can print your app log from tv.
// It like chrome devtools Console output.
tv.tvLog('ConsoleMessage');

````

How to using webDriver to build E2E TEST of your app on Tizen TV. [More see Example](https://github.com/sutaking/tizen-webapp-e2e-test)
````javascript
// As Setp 3, If you want using webdriver to your app, you donot using launch().
// You need instead of launchDebug()
// These function can return Pid & debug Port of your app.
let info = tv.launchDebug();

info = {
    pid,
    port
}

// The port will be using to chromedriver for create session.
var chrome_options = new chrome.Options();
chrome_options.options_["debuggerAddress"] = tvpi + ":" + info.port;

// driver wil be work.
var driver = chrome.Driver.createSession(chrome_options, service);
driver.findElement(xxx)
````

## License
MIT