import mongoose from 'mongoose';
import Schemas from './schemas';

const Peers = mongoose.model('peers', Schemas.peersSchema);

const PeersModel = {};

PeersModel.addPeer = async function(peerid, multiaddr) {
    const peer = await Peers.findOne({ peerid: peerid });
    if(!peer) {
        // 添加
        const res = await Peers.create({ 
            peerid: peerid,
            multiaddr: multiaddr
        });
        console.log("add: %s", res)
    }else {
        if(peer.multiaddr !== multiaddr) {
            // 更新
            const res = await Peers.update({ peerid: peerid }, { multiaddr: multiaddr });
            console.log("update: %s", res)
        }
    }
}

PeersModel.removePeer = async function(peerid) {
    const res = await Peers.deleteOne({ peerid: peerid });
    if(res) return true;
    else return false;
}


PeersModel.getPeersByType = async function(type) {
    const peers = await Peers.find({
        type: type
    });
    return peers;
}

PeersModel.getPeerByMultiaddr = async function(multiaddr) {
    const peer = await Peers.findOne({
        multiaddr: multiaddr
    });
    return peer;
}

export default PeersModel;