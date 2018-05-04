const Peer = require('./peer');

const network = {
    peer: null,

    start: () => {
        const peer = new Peer();   
        peer.start(function() {
            
        });

        console.log("2. 网络层已启动");
    },

    interface: {
        // 对下层 数据层 提供的接口

        // 从数据层向网络层发送数据
        emitDataFromData: function (data) {
            console.log("emitDataFromData" + data)
        },

        // 对上层 共识层 提供的接口
        
    }
}

module.exports = network;