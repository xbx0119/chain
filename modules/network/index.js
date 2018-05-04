const Peer = require('./peer');

const network = {
    peer: null,

    start: () => {
        network.peer = new Peer();   
        network.peer.start(function() {
            console.log("2. 网络层已启动");
            console.log("after operation")
        });

    },

    interface: {
        // 对下层 数据层 提供的接口

        // 从数据层向网络层发送数据
        emitDataFromDigital: function (type, data) {
            data = (typeof data === 'string') ? data : JSON.stringify(data);
            network.peer.emitSend('/' + type, data);
        },

        // 对上层 共识层 提供的接口
        
    }
}

module.exports = network;