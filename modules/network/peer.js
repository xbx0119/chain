const p2p = require('./p2p');
const PeerInfo = require('peer-info');
const PeerId = require('peer-id');
const waterfall = require('async/waterfall');
const crypto = require('libp2p-crypto');
const jwkToPem = require('jwk-to-pem');
const path = require('path');
const fs = require('fs');

const config = require('../../config');


class Peer {
    constructor() {
        if (!this.hasKey()) {
            this.genKey(() => {
                console.log("two")
                this.create();
            });
        }else {
            this.create();
        }
    }

    /**
     * 检查是否存在公钥和私钥
     * 不存在返回false，生成一个
     * 存在返回true，使用现有的
     */
    hasKey() {
        return fs.existsSync(config.rsaPrivateKey_path);
    }

    /**
     * 生成公钥、私钥，写入pem文件
     */
    genKey(callback) { 
        console.log("generate KeyPair");
        console.log("-----------------------------------");
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

    print(err, node) {
        if (err) { throw err }

        console.log("node has started (true/false): " + node.isStarted());
        console.log("listened on: ");
        node.peerInfo.multiaddrs.forEach((addr) => { console.log(addr.toString()) })
    }

    create() {
        let node;

        const privatePem = fs.readFileSync(config.rsaPrivateKey_path).toString();

        console.log("\n-------------------");
        console.log(privatePem);
        console.log("-------------------\n");

        crypto.keys.import(privatePem, '', (err, privKey) => {
            if(err) { throw err; }
            console.log(privKey)

            privKey.public.hash((err, digest) => {
                if(err) { throw err; }

                const id = new PeerId(digest, privKey);
                
                waterfall([
                    (cb) => PeerInfo.create(id, cb),
                    (peerInfo, cb) => {
                        peerInfo.multiaddrs.add(`/ip4/${config.address}/tcp/${config.port}`)
                        node = new p2p(peerInfo)
                        node.start(cb);

                        node.on('peer:discovery', (peer) => {
                            console.log("discovery: ", peer.id.toB58String())
                            node.dial(peer, (err, conn) => {
                                console.log("dial")
                            })
                        });

                        node.on('peer:connect', (peer) => {
                            console.log("connection established to: ", peer.id.toB58String())

                            setInterval(() => {
                                node.dialProtocol(peer, '/news', (err, conn) => {
                                    if (err) { throw err; }
                                    pull(
                                        pull.values(['this is a dial']),
                                        conn
                                    )
                                    console.log("dialprotocol")
                                })
                            }, 3000)


                        })

                        node.handle('/news', (protocol, conn) => {
                            pull(
                                conn,
                                pull.map((m) => m.toString()),
                                pull.log()
                            )
                        })

                    }
                ], (err) => this.print(err, node))

            })
            
        })

       
    }
}

module.exports = Peer;