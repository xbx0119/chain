import PeersModel from '../../models/peersModel';


class Peer {
    constructor() {
        global.peerType = 'citizen'; // 统一成为公民节点

        console.log("digital peer constructor")
    }

    async getPeers(page, size) {
        const peers = await PeersModel.getAllPeers(page, size);
        return peers;
    }

    async addPeer(peerid, multiaddr) {
        const res = await PeersModel.addPeer(peerid, multiaddr)
        if(res) { return true; }
        else { return false; }
    }

    async getPeersByType(type) {
        const peers = await PeersModel.getPeersByType(type);
        return peers;
    }

    async checkPeerType(peerid, type) {
        const peer = await PeersModel.getPeerByPeerid(peerid);

        if(peer && peer.type == type) {
            return true;
        }else {
            return false;
        }
    }

    async removePeer(peerid) {
        const res = await peersModel.removePeer(peer.peerid);
        if(res) { return true; }
        else { return false; }
    }

}


export default new Peer();