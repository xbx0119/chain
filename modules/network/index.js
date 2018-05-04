const Peer = require('./peer');

const network = {
    peer: null,

    start: () => {
        this.peer = new Peer();   
        this.peer.start(function() {
            console.log("after operation")
        });

        console.log("2. 网络层已启动");
    },

    interface: {
        // 对下层 数据层 提供的接口

        // 从数据层向网络层发送数据
        emitDataFromDigital: function (data) {
            console.log("emitDataFromDigital" + data)
        },

        // 对上层 共识层 提供的接口
        
    }
}

module.exports = network;