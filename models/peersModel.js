const mongoose = require('mongoose');
const Schemas = require('./schemas');
const Peers = mongoose.model('peers', Schemas.peersSchema);

const PeersModel = {};

PeersModel.findAll = async function () {
    try {
        
    } catch (e) {
        
    }
}

module.exports = PeersModel;