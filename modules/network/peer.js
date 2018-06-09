import p2p from './p2p';
import PeerInfo from 'peer-info';
import PeerId from 'peer-id';
import pull from 'pull-stream';
import waterfall from 'async/waterfall';
import crypto from 'libp2p-crypto';
import jwkToPem from 'jwk-to-pem';
import path from 'path';
import fs from 'fs';
import multiaddr from 'multiaddr';

import config from '../../config';

import digital from '../digital';
import consensus from '../consensus';

import { promisify } from 'es6-promisify';
import { connect } from 'mongoose';


class Peer {
    constructor() {
        this.node = null;

        if (!this.__hasKey()) {
            this.__genKey();
        }
        // 节点逻辑

    }

    // 检查是否存在公钥和私钥，不存在返回false，生成一个；存在返回true，使用现有的
    __hasKey() {
        return fs.existsSync(config.rsaPrivateKey_path);
    }

    // 生成公钥、私钥，写入pem文件
    async __genKey() { 
        console.log("generate KeyPair");
        // 回调函数式方法promise化
        const promiseGenKey = promisify(crypto.keys.generateKeyPair);
        
        try {
            const keys = await promiseGenKey('RSA', config.rsaBits);
            console.log(keys)

            let privateKey = keys._key,
                publicKey = keys._publicKey;

            let privatePem = jwkToPem(privateKey, { private: true }),
                publicPem = jwkToPem(publicKey);

            fs.writeFileSync(config.rsaPrivateKey_path, privatePem);
            fs.writeFileSync(config.rsaPublicKey_path, publicPem);
        } catch (err) {
            console.log("generate KeyPair ERROR!!!")
            throw err;
        }
    }

    __print() {
        console.log("node has started (true/false): " + this.node.isStarted());
        console.log("listened on: ");
        this.node.peerInfo.multiaddrs.forEach((addr) => { console.log(addr.toString()) })
    }

    async start() {
        const privatePem = fs.readFileSync(config.rsaPrivateKey_path).toString();
        
        try {
            const promiseKeysImport = promisify(crypto.keys.import);
            const privKey = await promiseKeysImport(privatePem, '');

            const promisePublicHash = promisify(privKey.public.hash.bind(privKey.public));
            const digest = await promisePublicHash()
            
            const id = new PeerId(digest, privKey);
            global.peerid = id.toB58String();

            const peerInfo = await promisify(PeerInfo.create)(id);

            peerInfo.multiaddrs.add(`/ip4/${config.address}/tcp/${config.port}`)

            this.node = new p2p(peerInfo)

            this.registDiscover();
            this.registReceiveType('/record');
            this.registReceiveType('/block');

            this.node.start(this.__print.bind(this));

        } catch (err) {
            console.log("import keys ERROR!!!")
            throw err;
        }
    }

    registDiscover() {
        this.node.on('peer:discovery', (peer) => {
            // console.log("discovery: ", peer.id.toB58String())
            // 连接节点
            this.node.dial(peer, (err, conn) => { 
                if(err) {
                    // console.log("节点不通");
                }else {
                    this.__addPeer(peer)
                }
            })
        });

        this.node.on('peer:connect', (peer) => {
            console.log("connection established to: ", peer.id.toB58String())
            // 打印连接的节点列表
            console.log(this.node.stats.peers())
        })
    }

    registReceiveType(type) {
        this.node.handle(type, (protocol, conn) => {
            this.getData(type, conn);
        })
    }


    sendData(conn, data) {
        try {
            pull(
                pull.values([data]),
                conn
            )
        } catch (err) {
            console.log(err)
        }
    }



    getData(protocol, conn) {
        try {
            pull(
                conn,
                pull.map((m) => m.toString()),
                pull.drain(function (data) {
                    consensus.interface.deliverDataFromNet(conn, protocol.slice(1), data)
                })
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
        digital.interface.toNet.addPeer(peerid, multiaddr);
    }
    
    async sendWhoTypeData(who, type, data) {
        who.forEach((peer) => {
            const addr = multiaddr(peer.multiaddr)
            console.log(addr)

            this.node.dialProtocol(addr, '/' + type, async (err, conn) => {
                if (err) {
                    console.log(err)
                    // 拨号不通，节点异常，数据库删除节点
                    // const res = await digital.interface.toNet.removePeer(peer.peerid)
                    // if (res) console.log("节点异常，删除成功")
                    console.log("节点异常: %s", peer.multiaddr)

                    // 若元老院节点或执政官节点异常,实行其他措施选举新节点,待实现!!!!!!!!!!!!!
                    // code
                } else {
                    console.log("dial %s & send data", peer.multiaddr)
                    this.sendData(conn, data);
                }
            })
        })
    }

}

export default Peer;