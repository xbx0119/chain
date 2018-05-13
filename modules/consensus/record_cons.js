/**
 * 交易记录共识
 * 依据节点类型对交易记录做相应处理
 */

import Consensus from './Consensus';

const record_cons = new Consensus('record_cons');

/**
 * 对来自网络层接收的record的共识--------------------------------------------------------------------------------
 */

// 元老院节点接受record存储
record_cons.fromNet.senateDeal = function() {
    console.log("元老院处理record")
};

// 公民节点接受record相互转发->引发循环
// 解决循环的方案：对每一个record，处理后存入数据库，再次接收到record时判断数据库中是否存在，存在则忽略
record_cons.fromNet.citizenDeal = function() {
    console.log("公民处理record")
};

// 执政官节点不接受处理record
record_cons.fromNet.archonDeal = function() {
    console.log("当前节点类型: archon不支持接受record")
};


/**
 * 对来自数据层的record的共识--------------------------------------------------------------------------------
 */

// 来自数据层的record为产生的交易，每个节点作为公民都可以产生交易，只需要转发给其他公民节点、上传给元老院节点即可
// 数据层产生了record交易信息，每个类型的节点都可以产生，只负责发送给元老院节点
record_cons.fromDigital.citizenDeal = function() {
    console.log("公民处理产生的交易")
};


export default record_cons;