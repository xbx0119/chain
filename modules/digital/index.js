// import digital modules
import Block from './block';
import Record from './record';

import config from '../../config';

import Network from '../network';


const digital = {
    Block: null,
    Record: null,

    start: () => {
        digital.Block = new Block();
        digital.Record = new Record();
        if(config.name != 'vultr') {
            setInterval(() => {

                Network.interface.emitDataFromDigital('record', digital.Record.produce())

            }, 5000);


            setInterval(async () => {
                Network.interface.emitDataFromDigital('block', await digital.Block.produce())
            }, 15 * 1000);
        }
        console.log("1. 数据层已启动");
    },

    interface: {
        // 对上层 网络层 提供的接口

        // 从网络层向下流动数据，即接受网络层的数据
        flowDataFromNet: function(type, data) {
            switch (type) {
                case 'record':
                    console.log("flowDataFromNet: |--  type: %s, data: %s", type, data);
                    digital.Block.addRecord2List(data)
                    break;
                case 'block':
                    console.log("flowDataFromNet: |--  type: %s, data: %s", type, data);
                    digital.Block.storeInDB(data)
                    break;
                default:
                    console.log("default")
                    break;
            }
        }
    }
}

export default digital;