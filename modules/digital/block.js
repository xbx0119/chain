import BlockModel from '../../models/blocksModel';

import record from './record';


class Block {
    constructor() {
        this.list = [];
    }

    async produce() {
        const block =  {
            height: await this.__height(),

            // 头部结构
            version: this.__version(),
            timestamp: this.__timestamp(),
            // 头哈希
            blockhash: this.__blockhash(), 
            // 父哈希
            parenthash: this.__parenthash(), 
             // 交易hash
            merkle: this.__merkle(),

            //区块主体，包含所有交易信息，即账本
            records: this.__records()
        }

        this.storeInDB(block)
        console.log("*****************")
        console.log(block)
        console.log("*****************")

        return block;
    }

    addBlock2List(item) {
        // const item = {hash: 'hash', block: 'block'}
        this.list.push(item);
    }


    // 存储区块到数据库
    // 存在之前的区块没有同步过来的情况，即当前数据库最大height不等于收到的block的height-1
    // 需要向其他节点同步一下数据
    // 需要完善!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async storeInDB(block) {
        // some code
        block = (typeof block == 'object') ? block : JSON.parse(block);
        const res = await BlockModel.addBlock(block);
        console.log(res)
        if(res) {
            console.log("store block to database");
            return true;
        }else {
            console.log("err: store block")
            return false;
        }
    }


    async __height() {
        const height = await BlockModel.maxHeight();
        return height + 1;    
    }

    __version() {
        return 'test';    
    }

    __timestamp() {
        return Date.now();    
    }

    __blockhash() {
        return 'test';    
    }

    __parenthash() {
        return 'test';    
    }

    __merkle() {
        return 'test';    
    }

    __records() {
        return record.getListValue();    
    }

}

export default new Block();