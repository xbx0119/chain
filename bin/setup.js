import jwkToPem from 'jwk-to-pem';
import path from 'path';
import fs from 'fs';
import { promisify } from 'es6-promisify';
import config from '../config/config.default.js';
import crypto from 'libp2p-crypto';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

import blocksModel from '../models/blocksModel';

import genesisBlock from '../genesisBlock.json';


// 创建用户配置,如果config.user.js存在则不创建
function __createUserConfig() {
    console.log("创建用户配置文件......");
    if (!fs.existsSync(config.rsaPrivateKey_path)) {
        const userConfig = 'const config = { \n\n }; \n\nexport default config;'
        fs.writeFileSync(path.resolve(__dirname, '../config/config.user.js'), userConfig);
        console.log("用户配置文件创建成功!");
    }else {
        console.log("用户配置文件已存在!");
    }
}

async function __insertGenesisBlock() {
    const dbURL = `mongodb://${config.db_host}/${config.db_name}`;

    const options = {
        keepAlive: true
    };
    if (config.db_user) { 
        options.user = config.db_user; 
        options.pass = config.db_passwd;
        options.auth = { authdb: 'admin' };
    }

    await mongoose.connect(dbURL, options).then(
        async () => {
            console.log("创建创世区块......");
            // 插入创世区块
            const res = await blocksModel.insertGenesisBlock(genesisBlock);
            if(res) {
                console.log("创世区块创建成功!");
            }else {
                console.log("创世区块创建失败!");
            }
        },
        (err) => { console.log("数据库连接失败" + err); }
    );
}


// 检查是否存在公钥和私钥，不存在返回false，生成一个；存在返回true，使用现有的
// 生成公钥、私钥，写入pem文件
async function __genKey() {
    console.log("创建公钥私钥对......");
    if (!fs.existsSync(config.rsaPrivateKey_path)) {
        // 回调函数式方法promise化
        const promiseGenKey = promisify(crypto.keys.generateKeyPair);

        try {
            const keys = await promiseGenKey('RSA', config.rsaBits);

            let privateKey = keys._key,
                publicKey = keys._publicKey;

            let privatePem = jwkToPem(privateKey, { private: true }),
                publicPem = jwkToPem(publicKey);

            fs.writeFileSync(config.rsaPrivateKey_path, privatePem);
            fs.writeFileSync(config.rsaPublicKey_path, publicPem);
            console.log("公钥私钥对创建成功!")
        } catch (err) {
            console.log("公钥私钥对创建失败!")
            throw err;
        }
    }else {
        console.log("公钥私钥对已存在!")
    }
}



async function setup() {
    
    __createUserConfig()
    await __insertGenesisBlock()
    
    await __genKey();

    console.log("安装完成！");

    process.exit();
}

setup()