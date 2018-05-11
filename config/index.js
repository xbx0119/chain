import fs from 'fs';
import path from 'path';

import configDefault from './config.default.js';
import configUser from './config.user.js';


let config = {};
Object.assign(config, configDefault, configUser);

console.log(JSON.stringify(config))
console.log()


export default config;