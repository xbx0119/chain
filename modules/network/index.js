const Peer = require('./peer');

const network = {
    start: () => {
        new Peer();   

        console.log("2. 网络层已启动");
    },

    interface: {
        // 对下层 数据层 提供的接口
        lower: {
            input: function() {
                console.log("向网络层输入数据")
            }
        },

        // 对上层 共识层 提供的接口
        upper: {

        }
    }
}

module.exports = network;