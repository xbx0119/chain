import p2p from './p2p';
import PeerInfo from 'peer-info';
import PeerId from 'peer-id';
import pull from 'pull-stream';
import waterfall from 'async/waterfall';
import crypto from 'libp2p-crypto';
import jwkToPem from 'jwk-to-pem';
import path from 'path';
import fs from 'fs';

import config from '../../config';

import peersModel from '../../models/peersModel';

import Digital from '../digital';


class Peer {
    constructor() {
        this.node = null;
        this.type = 'citizen'; // 统一成为公民节点

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
                    }
                ], (err) => {
                    this.__print(err)
                    callback()
                })
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

    async emitSend(protocol, data) {  
        console.log("emitSend: |-- type: %s, data: %s", protocol, data)
        
        switch (type) {
            case 'record':
                this.sendRecord(protocol, data);
                break;
            case 'block':
                
                break;
        
            default:
                break;
        }
        
    }

    // 发送交易记录
    sendRecord(protocol, data) {
        // 从数据库中获取元老节点
        let peers = await peersModel.getPeersByType('senate');

        // 向元老院发送数据
        peers.forEach((peer) => {
            this.node.dialProtocol(peer.multiaddr, protocol, (err, conn) => {
                if (err) {
                    // 拨号不通，节点异常，数据库删除节点
                    const res = peersModel.removePeer(peer.peerid);
                    if (res) console.log("节点异常，删除成功")

                    // 向元老院提议，排除此元老节点，选举新的元老
                    // code


                } else {
                    console.log("dial %s", peer.multiaddr)
                    this.sendData(conn, data);
                }
            })
        })
    }

    sendBlock(protocol, data) {
        // 从数据库中获取执政官节点
        let peers = await peersModel.getPeersByType('archon');

        // 向执政官发送数据
        peers.forEach((peer) => {
            this.node.dialProtocol(peer.multiaddr, protocol, (err, conn) => {
                if (err) {
                    // 执政官节点异常，但暂时不删除节点，直到选举产生新的执政官才删除或者说更新
                    // const res = peersModel.removePeer(peer.peerid);
                    // if (res) console.log("节点异常，删除成功")
                    console.log("执政官节点异常")

                    // 向元老院提议，选举新的执政官
                    // code


                } else {
                    console.log("dial %s", peer.multiaddr)
                    this.sendData(conn, data);
                }
            })
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
                    console.log(data)
                    Digital.interface.flowDataFromNet(protocol.slice(1), data);
                })
            )
        } catch (err) {
            console.log(err)
        }
    }

    // 收到交易记录
    getRecord() {
        if(this.type == 'senate') {

        }else {
            console.log("非元老院，不具备审核、存储交易的权利");
            // 转发交易，将收到的交易转发给自己知道的元老节点
            // code
        }
    }

    // 收到区块记录
    getBlock() {
        // 1. 执政官节点：排序，确定最终方案(一定时间内收到的区块集中，包含交易数量中位数的区块，交易记录数量为0则不生成区块)
        if(this.type == 'archon') {

        }
        // 2. 元老院节点：收到执政官最终敲定的区块，存储，入链，查找出尚未入块的交易，重新进入下一个区块的空间；向公民发布区块
        else if(this.type == 'senate') {

        }
        // 3. 公民节点：收到元老院下发的区块，存储
        else {

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


    
    broadcast2Citizen() {

    }

}

export default Peer;