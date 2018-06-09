import Peer from './peer';
import colors from 'colors';

class Network {

    constructor() {
        this.peer = new Peer()

        this.interface = {
            // 对下层 数据层 提供的接口

            getPeerType: function () {
                return this.peer.type;
            },

            // 对上层 共识层 提供的接口
            toConsensus: {
                sendWhoTypeData: this.peer.sendWhoTypeData.bind(this.peer)
            }

        }

        console.log("modules network constructor")
    }

    async start() {
        await this.peer.start();
        console.log(colors.green("1. 网络层已启动"))
        // 每一分钟获取其他节点的路由表
    }
}


const network = new Network()

export default network;