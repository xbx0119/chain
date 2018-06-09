// import digital modules
import Block from './block';
import Record from './record';
import Peer from './peer';

import config from '../../config';

import Network from '../network';
import Consensus from '../consensus';

import colors from 'colors';


class Digital {

    constructor() {
        this.Block = Block;
        this.Record = Record;
        this.Peer = Peer;

        this.interface = {
            // 对共识层提供的接口
            toConsensus: {
                record: {
                    checkSignatureThenHash: this.Record.checkSignatureThenHash,
                    getListValue: this.Record.getListValue,
                    addRecord2List: this.Record.addRecord2List,
                    removeConfirmedRecordFromList: this.Record.removeConfirmedRecordFromList,
                    isExistedInDB: this.Record.isExistedInDB,
                    storeInDB: this.Record.storeInDB
                },

                block: {
                    checkSignatureThenHash: this.Block.checkSignatureThenHash,
                    addBlock2List: this.Block.addBlock2List,
                    storeInDB: this.Block.storeInDB,
                },

                peer: {
                    getPeersByType: this.Peer.getPeersByType,
                    checkPeerType: this.Peer.checkPeerType
                }
            },

            toNet: {
                addPeer: this.Peer.addPeer,
                removePeer: this.Peer.removePeer
            },

            // 对外提供的Api
            api: {
                getBlocks: this.Block.getBlocks,
                
                getPeers: this.Peer.getPeers,

                createRecord: async (message) => {
                    const record = await this.Record.produce(message);
                    console.log("api createRecord: %s", JSON.stringify(record));
                    Consensus.interface.deliverDataFromDigital('record', record);
                    return record;
                },

                voteArchon: () => {},
                voteSenate: () => {}
            }


            // 对上层 网络层 提供的接口
        }

        console.log("modules digital constructor")
    }

    async start() {
        switch (global.peerType) {
            case 'citizen':
                console.log("公民节点,无需操作,等待api接受消息生成record")
                break;
            case 'senate':
                // 10秒产生一个区块
                setInterval(async () => {
                    const block = await this.Block.produce();
                    // 如果区块中records长度为0,即交易列表为空,不像网络传送
                    if(block.records.length !== 0) {
                        console.log(JSON.stringify(block))
                        Consensus.interface.deliverDataFromDigital('block', block);
                    }else {
                        console.log("senate: block.records.length = 0, after produce abandon toNet!")
                    }
                }, config.produceBlockGap * 1000);
                break;
            case 'archon': 
                // 10秒进行区块裁决
                setInterval(async () => {
                    const block = await this.Block.ruleBlock();
                    if(block) {
                        Consensus.interface.deliverDataFromDigital('block', block);
                    }else {
                        console.log("archon: after rule abandon toNet!")
                    }
                }, config.produceBlockGap * 1000);
                break;
            default:
                console.log("unknown peerType: %s", global.peerType)
                break;
        }

        console.log(colors.green("2. 数据层已启动"))
    }

}


const digital = new Digital()

export default digital;