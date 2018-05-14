import PeersModel from '../../peersModel';


class Peer {
    constructor() {

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


}


export default new Peer();