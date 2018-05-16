// import digital modules
import Block from './block';
import Record from './record';
import Peer from './peer';

import config from '../../config';

import Network from '../network';


class Digital {

    constructor() {
        this.Block = Block;
        this.Record = Record;
        this.Peer = Peer;

        this.interface = {
            // 对共识层提供的接口
            toConsensus: {
                record: {
                    getListValue: this.Record.getListValue,
                    addRecord2List: this.Record.addRecord2List,
                    removeConfirmedRecordFromList: this.Record.removeConfirmedRecordFromList,
                    isExistedInDB: this.Record.isExistedInDB,
                    storeInDB: this.Record.storeInDB
                },

                block: {
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

            API: {
                
            }


            // 对上层 网络层 提供的接口
        }

        console.log("modules digital constructor")
    }

    async start() {
        
        /* if(config.name != 'vultr') {
            setInterval(() => {
                Network.interface.emitDataFromDigital('record', this.Record.produce())
            }, 5000);

            setInterval(async () => {
                Network.interface.emitDataFromDigital('block', await this.Block.produce())
            }, 15 * 1000);
        } */

        console.log("2. 数据层已启动");
    }

}


const digital = new Digital()

export default digital;