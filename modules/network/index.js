import Peer from './peer';

class Network {

    constructor() {
        this.peer = new Peer()

        this.interface = {
            // 对下层 数据层 提供的接口

            getPeerType: function () {
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
                sendWhoTypeData: this.peer.sendWhoTypeData
            }

        }

        console.log("modules network constructor")
    }

    async start() {
        await this.peer.start();
        console.log("1. 网络层已启动");
    }
}


const network = new Network()

export default network;