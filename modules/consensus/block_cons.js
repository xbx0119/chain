/**
 * 区块共识
 * 依据节点类型对区块做相应处理
 */

/**
 * 区块的类型：
 *     1. 提案区块
 *     2. 决策区块
 */

import Consensus from './Consensus';

const block_cons = new Consensus('block_cons');


/**
 * 对来自网络层接收的block的共识--------------------------------------------------------------------------------
 */

// 执政官从网络收到block，按一定策略选择
// 执政官节点接受元老院提交的block进行裁决
block_cons.fromNet.archonDeal = function() {

};

// 元老院节点收到执政官下达的决策区块
// 元老院接受来自执政官节点的block存储区块，鉴定后存储，下达公民
// 注意还需要判定消息是否真的来自于执政官
block_cons.fromNet.senateDeal = function () {
            
};

// 公民节点收到元老院公布的决策区块
// 公民节点接受来自元老院的block，鉴定后负责存储
block_cons.fromNet.citizenDeal = function () {
            
}



/**
 * 对来自数据接收的block的共识--------------------------------------------------------------------------------
 */

// 元老院节点从数据层产生了block后，使用网络层上传给执政官
// 元老院生成block，提案给执政官
block_cons.fromDigital.senateDeal = function() {

};

// 执政官从数据层产生block后，使用网络层下发给元老院
// 执政官节点产生block，下达给元老院
block_cons.fromDigital.archonDeal = function() {

};

export default block_cons;