// import digital modules
const Block = require('./block');
const Record = require('./record');

const config = require('../../config');

const Network = require('../network');


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
        }
        console.log("1. 数据层已启动");
    },

    interface: {
        // 对上层 网络层 提供的接口

        // 从网络层向下流动数据，即接受网络层的数据
        flowDataFromNet: function(type, data) {
            console.log("flowDataFromNet")

            switch (type) {
                case 'record':
                    console.log("flowDataFromNet: |--  type: %s, data: %s", type, data);
                    
                    break;
                case 'block':
                    console.log("flowDataFromNet: |--  type: %s, data: %s", type, data);
                    break;
                default:
                    break;
            }
        }
    }
}

module.exports = digital;