import BlockModel from '../../models/blocksModel';


class Block {
    constructor() {
        this.recordlist = [];
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

        return block;
    }

    addRecord2List(record) {
        this.recordlist.push(record)
    }

    cleanRecordList() {
        this.recordlist = [];
    }

    // 存储区块到数据库
    async storeInDB(block) {
        // some code
        block = (typeof block == 'object') ? block : JSON.parse(block);
        const res = await BlockModel.addBlock(block);
        console.log(res)
        if(res) {
            console.log("store block to database");
        }else {
            console.log("err: store block")
        }
    }


    async __height() {
        const height = await BlockModel.maxHeight();
        console.log(height)
        return height + 1;    
    }

    __version() {
        return 'test';    
    }

    __timestamp() {
        return 'test';    
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
        const records = this.recordlist;
        this.recordlist = [];

        return records;    
    }

}

export default Block;