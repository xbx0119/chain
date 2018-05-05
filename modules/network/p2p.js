import Libp2p from 'libp2p';
import TCP from 'libp2p-tcp';
// const PeerInfo = require('peer-info');

import SPDY from 'libp2p-spdy';
import SECIO from 'libp2p-secio';

import Railing from 'libp2p-railing';
import MulticastDNS from 'libp2p-mdns';

import KadDHT from 'libp2p-kad-dht';

import config from '../../config';

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
                // new MulticastDNS(peerinfo, {interval: 1000})
            ],
            DHT: KadDHT
        }
        super(modules, peerinfo);
    }
}

export default P2P;
