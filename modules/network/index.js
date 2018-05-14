import Peer from './peer';

const network = {
    peer: null,

    start: function(next) {
        this.peer = new Peer();   
        this.peer.start(function() {
            console.log("1. 网络层已启动");
            next()
        });

    },

    interface: {
        // 对下层 数据层 提供的接口

        getPeerType: function() {
            return this.peer.type;
        },

        // 从数据层向网络层发送数据
        emitDataFromDigital: function (type, data) {
            data = (typeof data === 'string') ? data : JSON.stringify(data);
            console.log("emitDataFromDigital: " + data)
            network.peer.emitSend('/' + type, data);
        },

        // 对上层 共识层 提供的接口

        toConsensus: {
            /**
             * who: arr   type: string    data: string
             */
            sendWhoTypeData: function(who, type, data) {

            }
        }
        
    }
}

export default network;