const p2p = require('./p2p');
const PeerInfo = require('peer-info');
const PeerId = require('peer-id');
const pull = require('pull-stream');
const waterfall = require('async/waterfall');
const crypto = require('libp2p-crypto');
const jwkToPem = require('jwk-to-pem');
const path = require('path');
const fs = require('fs');

const config = require('../../config');


class Peer {
    constructor() {
        if (!this.__hasKey()) {
            this.__genKey(() => {
                this.start();
            });
        }else {
            this.start();
        }
    }

    /**
     * 检查是否存在公钥和私钥，不存在返回false，生成一个；存在返回true，使用现有的
     */
    __hasKey() {
        return fs.existsSync(config.rsaPrivateKey_path);
    }

    /**
     * 生成公钥、私钥，写入pem文件
     */
    __genKey(callback) { 
        console.log("generate KeyPair");
        crypto.keys.generateKeyPair('RSA', config.rsaBits, (err, keys) => {
            if(err) { throw err; }
            // 打印私钥对象RsaPrivateKey
            console.log(keys)

            let privateKey = keys._key,
                publicKey = keys._publicKey;

            let privatePem = jwkToPem(privateKey, { private: true }),
                publicPem = jwkToPem(publicKey);

            fs.writeFileSync(config.rsaPrivateKey_path, privatePem);
            fs.writeFileSync(config.rsaPublicKey_path, publicPem);

            callback();
        })
    }

    __print(err, node) {
        if (err) { throw err }

        console.log("node has started (true/false): " + node.isStarted());
        console.log("listened on: ");
        node.peerInfo.multiaddrs.forEach((addr) => { console.log(addr.toString()) })
    }

    start() {
        let node;
        const privatePem = fs.readFileSync(config.rsaPrivateKey_path).toString();

        crypto.keys.import(privatePem, '', (err, privKey) => {
            if(err) { throw err; }

            privKey.public.hash((err, digest) => {
                if(err) { throw err; }

                const id = new PeerId(digest, privKey);
                
                waterfall([
                    (cb) => PeerInfo.create(id, cb),
                    (peerInfo, cb) => {
                        peerInfo.multiaddrs.add(`/ip4/${config.address}/tcp/${config.port}`)
                        node = new p2p(peerInfo)
                        node.start(cb);

                        this.registDiscover(node);
                        this.registEvent(node);

                        this.registProtocol(node, '/news');
                    }
                ], (err) => this.__print(err, node))
            })
        }) 
    }

    registDiscover(node) {
        node.on('peer:discovery', (peer) => {
            console.log("discovery: ", peer.id.toB58String())
            node.dial(peer, (err, conn) => { })
        });

        node.on('peer:connect', (peer) => {
            console.log("connection established to: ", peer.id.toB58String())
            console.log(node.stats.peers())
        })
    }

    registReceiveType(node, protocol) {
        node.handle(protocol, (protocol, conn) => {
            this.getData(protocol, conn);
        })
    }

    registSendType(node) {  
        /* 
            setTimeout(() => {
                // 从数据库随机查询节点发送消息
                node.peerRouting.findPeer(PeerId.createFromB58String('Qmd3jJYEc5o4DK9paSKN4nEeJEwRtshZY5eZ4b148VDHjD'), (err, peer) => {
                    if (err) { throw err }
                    
                    console.log('Found it, multiaddrs are:')
                    peer.multiaddrs.forEach((ma) => console.log(ma.toString()))
                    
                }) 
            }, 1000);
        */

        node.dialProtocol(peer, '/news', (err, conn) => {
            if (err) { throw err; }
            this.sendData(conn);
        })
    }

    getData(protocol, conn) {
        try {
            pull(
                conn,
                pull.map((m) => m.toString()),
                pull.log()
            )
        } catch (err) {
            console.log(err)
        }
    }

    sendData(conn) {
        try {
            pull(
                pull.values([`from ${config.name}: this is a dialProtocol news `]),
                conn
            )
        } catch (err) {
            console.log(err)
        }
    }


    


}

module.exports = Peer;