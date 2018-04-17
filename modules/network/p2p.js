const Libp2p = require('libp2p');
const TCP = require('libp2p-tcp');
// const PeerInfo = require('peer-info');

const SPDY = require('libp2p-spdy');
const SECIO = require('libp2p-secio');

const Railing = require('libp2p-railing');
const MulticastDNS = require('libp2p-mdns');

const DHT = require('libp2p-kad-dht');

const config = require('../../config');

class P2P extends Libp2p {
    constructor(peerinfo) {
        const modules = {
            transport: [new TCP()],
            connection: {
                muxer: [SPDY],
                crypto: [SECIO]
            },
            discovery: [
                new Railing(config.peers.list),
                new MulticastDNS(peerinfo, {interval: 1000})
            ],
            dht: DHT
        }
        super(modules, peerinfo);
    }
}

module.exports = P2P;
