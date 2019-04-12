# Sdb.js

Base on Tizen WebApp SDB Command Line Devtools. You need open ssh server on your tv or emulator first. If not, sdb.js can not work. 

## Installation

Need install sshpass first:
````
$ npm install git+https://git@github.com/sutaking/sdb.js.git#master

// If you donot know how to 
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

tv.launch();

tv.kill()

tv.uninstall();

tv.tvLog('ConsoleMessage');



````

How to using webDriver to your app on Tizen TV
````javascript

tv.launchDebug();
````

## License
MIT