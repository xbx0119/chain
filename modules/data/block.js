class Block {
    constructor() {
        this.data = this.produce();
    }

    produce() {
        return {
            height: this.__height(),

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
    }


    __height() {
        return 'test';    
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
        return [];    
    }

}

module.exports = Block;