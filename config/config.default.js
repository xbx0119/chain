/**
 * 默认包含全部的配置项
 * 通过在config.user.js中重写以覆盖
 */


import path from 'path';

const config = {
    version: "0.0.1",
    name: 'chain',

    // 节点启动的端口和地址
    port: 9999,
    address: "0.0.0.0",

    // 数据库配置
    db_host: 'localhost',
    db_name: 'chain',
    db_user: 'root',
    db_passwd: '806119',


    // 产生区块的时间间隔,单位:秒
    produceBlockGap: 10,


    // 已知的节点列表
    peers: {
        list: [
        ]
    },
    
    // 图形界面端口和地址
    ui_port: 9998,
    ui_address: "127.0.0.1",

    // 安装过程ui的端口地址
    setup_port: 9997,
    setup_address: "127.0.0.1",

    rsaBits: 2048,
    rsaPrivateKey_path: path.join(__dirname, 'chain_rsa'),
    rsaPublicKey_path: path.join(__dirname, 'chain_rsa.pub')
}

export default config;