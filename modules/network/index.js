const Peer = require('./peer');

const network = {
    start: () => {
        new Peer()   
    },

    interface: {
        // 对下层 数据层 提供的接口
        lower: {

        },

        // 对上层 共识层 提供的接口
        upper: {

        }
    }
}

module.exports = network;