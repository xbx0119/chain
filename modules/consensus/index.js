/**
 * 共识机制：古罗马共识
 * 三层角色：
 *    执政官archon：主要负责收集元老院提交的区块提案，按区块中包含的record数量，取中位数选择最终区块，加入执政官标识，下发给元老院
 *    元老院senate：主要负责存储收到的record，每十秒打包记录生成区块发送给执政官；收到的block存储，转发给citizen；
 *                 根据收到的区块，将record池中未进入block的记录重新排入下一个区块提案
 *    公民citizen：主要负责生成交易信息record，收到的record转发给自己已知的元老节点，收到的block存储
 * 
 */

import Network from '../network';
import RecordCons from './peer_cons';
import BlockCons from './block_cons';
import PeerCons from './peer_cons';


const consensus = {

    start: function() {
        console.log("3. 共识层已启动");

    },

    interface: {
        // 从网络层接收数据，处理后传递给数据层
        deliverDataFromNet: function (type, data) {
            const peer_type = Network.peer.type;
            
            switch (type) {
                case 'record':
                    if(peer_type === 'citizen') {
                        RecordCons.fromNet.citizenDeal();
                    }else if(peer_type === 'senate') {
                        RecordCons.fromNet.senateDeal();
                    }else if(peer_type === 'archon') {
                        RecordCons.fromNet.archonDeal();
                    }else {
                        RecordCons.fromNet.unSupportDeal('不支持的节点');
                    } 
                    break;
                case 'block':
                    if (peer_type === 'archon') {
                        BlockCons.fromNet.archonDeal();
                    } else if (peer_type === 'senate') {
                        BlockCons.fromNet.senateDeal()
                    } else if(peer_type === 'citizen') {
                        BlockCons.fromNet.citizenDeal();
                    }else {
                        BlockCons.fromNet.unSupportDeal('当前节点类型不支持接受record')
                    }
                    break;
                case 'peer':
                    // 关于节点身份更新的消息，基于身份的共识基础
                    console.log("待开发")
                    break;
                default:
                    console.log('不支持的消息类型');
                    break;
            }
        },
        
        // 从数据层接受数据，处理后传递给网络层
        deliverDataFromDigital: function() {
            const peer_type = Network.peer.type;

            switch (type) {
                case 'record':
                    RecordCons.fromDigital.citizenDeal();
                    break;
                case 'block':
                    if (peer_type === 'archon') {
                        BlockCons.fromDigital.archonDeal();
                    }else if(peer_type === 'senate') {
                        BlockCons.fromDigital.senateDeal();
                    }else if(peer_type === 'citizen') {
                        BlockCons.fromDigital.unSupportDeal('公民节点不能产生block')
                    }else {
                        BlockCons.fromDigital.unSupportDeal('不支持的节点类型')
                    }
                    break;
                case 'peer':
                    console.log('待开发')
                    break;
                default:
                    console.log('不支持的消息类型');
                    break;
            }
        }

    }
}

export default consensus;