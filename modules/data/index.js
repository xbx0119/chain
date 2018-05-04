// import data modules
const Block = require('./block');
const record = require('./record');


const data = {
    start: () => {

        console.log("1. 数据层已启动");
    },

    interface: {
        // 对上层 网络层 提供的接口

        // 从网络层向下流动数据，即接受网络层的数据
        flowDataFromNet: function(data) {
            console.log("flowDataFromNet")
        }
    }
}

module.exports = data;