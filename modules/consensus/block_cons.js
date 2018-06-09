/**
 * 区块共识
 * 依据节点类型对区块做相应处理
 */

/**
 * 区块的类型：
 *     1. 提案区块
 *     2. 决策区块
 */

import digital from '../digital';
import network from '../network';

import CommonConsensus from './CommonConsensus';

const block_cons = new CommonConsensus('block_cons');

/**
 * 对来自网络层接收的block的共识--------------------------------------------------------------------------------
 */

// 执政官从网络收到block，加入block队列，一定时间后对队列中的block按一定策略选择
// 执政官节点接受元老院提交的block进行裁决
block_cons.fromNet.archonDeal = async function(peerid, block) {
    block = (typeof block === 'object') ? block : JSON.parse(block);

    // 检查合法性
    const legal = digital.interface.toConsensus.block.checkSignatureThenHash(block);
    if (!legal) { return false; }

    // 1. 验证发送人是否是元老院节点
    const fromSenate = await digital.interface.toConsensus.peer.checkPeerType(peerid, 'senate');

    // 2. 加入block队列
    if(fromSenate) {
        const item = {
            hash: block.hash,
            block: JSON.stringify(block)
        }
        digital.interface.toConsensus.block.addBlock2List(item)
    }

};

// 元老院节点收到执政官下达的决策区块
// 元老院接受来自执政官节点的block存储区块，鉴定后存储，下达公民
// 注意还需要判定消息是否真的来自于执政官
block_cons.fromNet.senateDeal = async function (peerid, block) {
    block = (typeof block === 'object') ? block : JSON.parse(block);

    // 检查合法性
    const legal = digital.interface.toConsensus.block.checkSignatureThenHash(block);
    // if (!legal) { return false; }

    // 1. 鉴定是否是执政官节点下达的
    const fromArchon = await digital.interface.toConsensus.peer.checkPeerType(peerid, 'archon');

    if (fromArchon) {
        // 2. 将决策区块存储数据库
        const store = await digital.interface.toConsensus.block.storeInDB(block);
        
        // 3. 提取区块中的交易信息，与record列表中的交易比对，排除已经进入区块的record
        if(store) {
            const confirmedRecords = block.records; // 对象
            digital.interface.toConsensus.record.removeConfirmedRecordFromList(confirmedRecords);
        }  
    }

};

// 公民节点收到元老院公布的决策区块
// 公民节点接受来自元老院的block，鉴定后负责存储
block_cons.fromNet.citizenDeal = async function (peerid, block) {
    block = (typeof block === 'object') ? block : JSON.parse(block);

    // 检查合法性
    const legal = digital.interface.toConsensus.block.checkSignatureThenHash(block);
    if (!legal) { return false; }

    // 1. 鉴定是否是元老院公布的
    const fromSenate = await digital.interface.toConsensus.peer.checkPeerType(peerid, 'senate');

    if(fromSenate) {
        // 2. 存储进入数据库
        const store = await digital.interface.toConsensus.block.storeInDB(block);
    }

}



/**
 * 对来自数据接收的block的共识--------------------------------------------------------------------------------
 */

// 元老院节点从数据层产生了block后，使用网络层上传给执政官
block_cons.fromDigital.senateDeal = async function(block) {
    block = (typeof block === 'object') ? block : JSON.parse(block);

    // 1. 上传给执政官
    const archonPeers = await digital.interface.toConsensus.peer.getPeersByType('archon');
    network.interface.toConsensus.sendWhoTypeData(archonPeers, 'block', JSON.stringify(block));

};

// 执政官从数据层产生block后，使用网络层下发给元老院
block_cons.fromDigital.archonDeal = async function(block) {
    block = (typeof block === 'object') ? block : JSON.parse(block);

    // 1. 下达给元老院
    const senatePeers = await digital.interface.toConsensus.peer.getPeersByType('senate');
    network.interface.toConsensus.sendWhoTypeData(senatePeers, 'block', JSON.stringify(block));
};

export default block_cons;