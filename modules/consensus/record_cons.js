/**
 * 交易记录共识
 * 依据节点类型对交易记录做相应处理
 */

import digital from '../digital';
import network from '../network';

import CommonConsensus from './CommonConsensus';

const record_cons = new CommonConsensus('record_cons');

/**
 * 对来自网络层接收的record的共识--------------------------------------------------------------------------------
 */

// 元老院节点接受record存储
record_cons.fromNet.senateDeal = function(record) {
    console.log("元老院处理record")
    // 检查合法性
    const legal = digital.interface.toConsensus.record.checkSignatureThenHash(record);
    if(!legal) { return false; }

    // record存入队列， 按hash标识唯一性，队列属性key/value：hash/record
    record = (typeof record === 'object') ? record : JSON.parse(record);
    const item = {
        hash: record.hash,
        record: JSON.stringify(record)
    }
    digital.interface.toConsensus.record.addRecord2List(item)
};

// 公民节点接受record相互转发->引发循环
// 解决循环的方案：对每一个record，处理后存入数据库，再次接收到record时判断数据库中是否存在，存在则忽略
record_cons.fromNet.citizenDeal = async function(record) {
    console.log("公民处理record")
    record = (typeof record === 'object') ? record : JSON.parse(record);

    // 检查合法性
    const legal = digital.interface.toConsensus.record.checkSignatureThenHash(record);
    if (!legal) { return false; }

    // 1. 检测数据库是否存在此记录，存在则忽略返回，不存在则处理
    const exist = await digital.interface.toConsensus.record.isExistedInDB(record.hash);
    if(exist) { return; }

    // 2. 将此记录存入数据库
    const store = await digital.interface.toConsensus.record.storeInDB(record);

    // 3. 转发给其他公民节点
    if(store) {
        const citizenPeers = await digital.interface.toConsensus.peer.getPeersByType('citizen');
        network.interface.toConsensus.sendWhoTypeData(citizenPeers, 'record', JSON.stringify(record))
    }
};

// 执政官节点不接受处理record
record_cons.fromNet.archonDeal = function() {
    console.log("当前节点类型: archon不支持接受record")
};



/**
 * 对来自数据层的record的共识--------------------------------------------------------------------------------
 */

// 数据层产生了record交易信息，每个节点作为公民都可以产生交易，只需要转发给其他公民节点、上传给元老院节点即可
record_cons.fromDigital.citizenDeal = function(record) {
    console.log("公民处理产生的交易")
    record = (typeof record === 'object') ? record : JSON.parse(record);

    // 1. 上传给元老节点
    const senatePeers = await digital.interface.toConsensus.peer.getPeersByType('senate');
    network.interface.toConsensus.sendWhoTypeData(senatePeers, 'record', JSON.stringify(record))

    // 2. 存入此record到数据库
    const store = await digital.interface.toConsensus.record.storeInDB(record);

    // 3. 转发给其他公民节点
    if(store) {
        const citizenPeers = await digital.interface.toConsensus.peer.getPeersByType('citizen');
        network.interface.toConsensus.sendWhoTypeData(citizenPeers, 'record', JSON.stringify(record))
    }

};


export default record_cons;