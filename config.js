const path = require('path');

const config = {
    version: "0.0.1",

    // 节点启动的端口和地址
    port: 9999,
    address: "0.0.0.0",

    // 已知的节点列表
    peers: {
        list: [
            
        ]
    },
    
    // 图形界面端口和地址
    ui_port: 9998,
    ui_address: "127.0.0.1",

    rsaBits: 2048,
    rsaPrivateKey_path: path.join(__dirname, './bin/', 'chain_rsa'),
    rsaPublicKey_path: path.join(__dirname, './bin/', 'chain_rsa.pub')
}

module.exports = config;