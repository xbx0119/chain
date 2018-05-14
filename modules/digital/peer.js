import PeersModel from '../../peersModel';


class Peer {
    constructor() {

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

    async checkPeerType(multiaddr, type) {
        const peer = await PeersModel.getPeerByMultiaddr(multiaddr);

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