import hasha from 'hasha';
import fs from 'fs';

import config from '../../config';

import BlockModel from '../../models/blocksModel';

import record from './record';


class Block {
    constructor() {
        this.list = [];
        console.log("digital block constructor")
    }

    async produce() {
        const block =  {
            height: await this.__height(),

            // 头部结构
            version: this.__version(),
            timestamp: this.__timestamp(),
            // 父哈希
            parenthash: await this.__parenthash(), 
            publicKey: this.__publicKey(),
            //区块主体，包含所有交易信息，即账本
            records: this.__records()    
        }
        // 交易hash
        block.merkle = this.__merkle(block);
        // 头哈希
        // block.blockhash = this.__blockhash(block);
        // 签名
        // block.signature = this.__signature(block)

        console.log("*****************")
        console.log(block)
        console.log("*****************")

        return block;
    }        
    

    checkHash(block) {

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
        return config.version;    
    }

    __timestamp() {
        return Date.now();    
    }

    async __parenthash() {
        const lastBlock = await BlockModel.findLastBlock();

        return lastBlock.blockhash;
    }

    __records() {
        return record.getListValue();    
    }
    
    __merkle(block) {
        if(block.records.length == 0) {
            return '';
        }

        let hashArr = block.records.map((record) => {
            return hasha([JSON.stringify(record)]);
        })

        while(hashArr.length != 1) {
            let tmp = [];
            for(let start = 0, length = hashArr.length; start < length; start+=2) {
                let tmp_hash = '';
                if(hashArr[start + 1]) {
                    tmp_hash = hasha([hashArr[start], hashArr[start+1]]);
                }else {
                    tmp_hash = hasha([hashArr[start]]);
                }
                tmp.push(tmp_hash);
            }
            hashArr = tmp;
        }

        const markle = hashArr[0];
        return markle;
    }
    
    __blockhash(block) {
        return hasha(JSON.stringify(block));
    }

    __publicKey() {
        const publicKey = fs.readFileSync(config.rsaPublicKey_path).toString();
        return publicKey;
    }

    __signature(block) {
        const privateKey = fs.readFileSync(config.rsaPrivateKey_path);
        const publicKey = fs.readFileSync(config.rsaPublicKey_path);

        const ecdsa = jwa('RS256');

        const signature = ecdsa.sign(block.blockhash, privateKey);

        return signature;

        // 验证签名
        // ecdsa.verify(block.blockhash, signature, publicKey) // === true
    }

}

const block = new Block();

export default block;