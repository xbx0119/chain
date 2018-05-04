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

const peersModel = require('../../models/peersModel');

const Digital = require('../digital');


class Peer {
    constructor() {
        this.node = null;
        if (!this.__hasKey()) {
            this.__genKey();
        }
    }

    // 检查是否存在公钥和私钥，不存在返回false，生成一个；存在返回true，使用现有的
    __hasKey() {
        return fs.existsSync(config.rsaPrivateKey_path);
    }

    // 生成公钥、私钥，写入pem文件
    __genKey() { 
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
        })
    }

    __print(err) {
        if (err) { throw err }

        console.log("node has started (true/false): " + this.node.isStarted());
        console.log("listened on: ");
        this.node.peerInfo.multiaddrs.forEach((addr) => { console.log(addr.toString()) })
    }

    start(callback) {
        // let node;
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
                        this.node = new p2p(peerInfo)
                        this.node.start(cb);

                        this.registDiscover();
                        
                        this.registReceiveType('/record');
                        this.registReceiveType('/block');

                        callback()
                    }
                ], (err) => this.__print(err))
            })
        }) 
    }

    registDiscover() {
        this.node.on('peer:discovery', (peer) => {
            console.log("discovery: ", peer.id.toB58String())
            // 连接节点
            this.node.dial(peer, (err, conn) => { 
                if(err) {
                    console.log("节点不通");
                }else {
                    this.__addPeer(peer)
                }
            })
            

            // this.emitSend('/record', {
            //     "version": 0,
            //     "timestamp": Date.now(),
            //     "recipientId": "0",
            //     "senderId": "1",
            //     "senderPublicKey": "1",
            //     "hash": "1", 
            //     "message": "i send b a seed", 
            //     "signature": "0", 
            // });
        });

        this.node.on('peer:connect', (peer) => {
            console.log("connection established to: ", peer.id.toB58String())
            // 打印连接的节点列表
            console.log(this.node.stats.peers())
        })
    }

    registReceiveType(protocol) {
        this.node.handle(protocol, (protocol, conn) => {
            this.getData(protocol, conn);
        })
    }

    async emitSend(protocol, data) {  
        console.log("emitSend: |-- type: %s, data: %s", protocol, data)
        // 从数据库中获取peer发送数据
        let peers = await peersModel.getAllPeers();
        
        peers.forEach((peer) => {
            this.node.dialProtocol(peer.multiaddr, protocol, (err, conn) => {
                if (err) { 
                    // 拨号不通，节点异常，数据库删除节点
                    const res = peersModel.removePeer(peer.peerid);
                    if(res) console.log("节点异常，删除成功")
                }
                console.log("dial %s", peer.multiaddr)
                this.sendData(conn, data);
            })
        })
    }

    getData(protocol, conn) {
        try {
            pull(
                conn,
                pull.map((m) => JSON.parse(m)),
                console.log()
            )
        } catch (err) {
            console.log(err)
        }
    }

    sendData(conn, data) {
        try {
            pull(
                pull.values([`${JSON.stringify(data)}`]),
                conn
            )
        } catch (err) {
            console.log(err)
        }
    }

    // 节点存入数据库
    __addPeer(peer) {
        let multiaddr = '',
            peerid = peer.id.toB58String();
        peer.multiaddrs.forEach((addr) => multiaddr = addr.toString());
        // 数据库操作 存入multiaddr
        peersModel.addPeer(peerid, multiaddr)
    }

}

module.exports = Peer;