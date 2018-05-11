/**
 * 共识机制：古罗马共识
 * 三层角色：
 *    执政官archon：主要负责收集元老院提交的区块提案，按区块中包含的record数量，取中位数选择最终区块，加入执政官标识，下发给元老院
 *    元老院senate：主要负责存储收到的record，每十秒打包记录生成区块发送给执政官；收到的block存储，转发给citizen；
 *                 根据收到的区块，将record池中未进入block的记录重新排入下一个区块提案
 *    公民citizen：主要负责生成交易信息record，收到的record转发给自己已知的元老节点，收到的block存储
 * 
 */





const consensus = {
    peer: null,

    start: () => {
        console.log("3. 共识层已启动");

    },

    interface: {
        // 对下层 数据层 提供的接口
        

    }
}

export default network;