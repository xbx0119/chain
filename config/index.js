const fs = require('fs');
const path = require('path');

let configDefault = require('./config.default.js');


let configUser = {};
if (fs.existsSync(path.join(__dirname, './config.user.js'))) {
    configUser = require('./config.user.js')
}


let config = {};
Object.assign(config, configDefault, configUser);

console.log(config)


module.exports = config;