import hasha from 'hasha';
import fs from 'fs';
import jwa from 'jwa';

import config from '../../config';

import BlocksModel from '../../models/blocksModel';

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
            senderId: this.__senderId(),
            // 父哈希
            parenthash: await this.__parenthash(), 
            publicKey: this.__publicKey(),
            //区块主体，包含所有交易信息，即账本
            records: this.__records()    
        }
        // 交易hash
        block.merkle = this.__merkle(block);
        // 头哈希
        block.blockhash = this.__blockhash(block);
        // 签名
        block.signature = this.__signature(block)

        return block;
    } 
    
    // 执政官裁决区块列表,选出最终入链的区块
    async ruleBlock() {
        if(this.list.length === 0) {
            console.log("archon: blocklist.length = 0, abandon")
            return false;
        }

        // 固定当前列表,防止期间新的区块进入列表
        let currentList = [].concat(this.list);
        this.clearList();
        
        // 选择策略: 按records数量从高到低排序,取中间数
        currentList.sort((a, b) => {
            return JSON.parse(b.block).records.length - JSON.parse(a.block).records.length;
        });

        // 如果最大records数量都为0,则抛弃所有区块
        if (JSON.parse(currentList[0].block).records && JSON.parse(currentList[0].block).records.length === 0) {
            console.log("max records.length 0, abandon!!!")
            return false;
        }

        // 选择中间数
        const pos = Math.ceil(currentList.length / 2) - 1;
        const block = JSON.parse(currentList[pos].block);
        
        block.records = block.records.map((item) => {
            return JSON.parse(item)
        })


        const res = await this.storeInDB(block);
        if(res) {
            return block;
        }else {
            console.log("ruleBlock error!!!!!!")
            return false;
        }            
    }
    

    checkSignatureThenHash(block) {
        block = (typeof block === 'object') ? block : JSON.parse(block);
        const ecdsa = jwa('RS256');
        // 验证签名
        const flag = ecdsa.verify(block.blockhash, block.signature, block.publicKey);
        if(flag) {
            // 签名通过,验证hash是否合法
            const tmp = Object.assign({}, block);
            delete tmp.signature; delete tmp.blockhash;
            const hash = hasha(JSON.stringify(tmp));
            if (hash === block.blockhash) {
                return true;
            } else {
                return false;
            }
        }else {
            return false;
        }
    }

    addBlock2List(item) {
        // const item = {hash: 'hash', block: 'block'}
        this.list.push(item);
    }

    clearList() {
        this.list = [];
    }

    // 存储区块到数据库
    // 存在之前的区块没有同步过来的情况，即当前数据库最大height不等于收到的block的height-1
    // 需要向其他节点同步一下数据
    // 需要完善!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async storeInDB(block) {
        // some code
        block = (typeof block == 'object') ? block : JSON.parse(block);
        const res = await BlocksModel.addBlock(block);
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
        const height = await BlocksModel.maxHeight();
        return height + 1;    
    }

    __version() {
        return config.version;    
    }

    __timestamp() {
        return Date.now();    
    }

    __senderId() {
        // peer.start()中绑定到global上
        return global.peerid;
    }

    async __parenthash() {
        const lastBlock = await BlocksModel.findLastBlock();

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

        const merkle = hashArr[0];
        return merkle;
    }

    __publicKey() {
        const publicKey = fs.readFileSync(config.rsaPublicKey_path).toString();
        return publicKey;
    }
    
    __blockhash(block) {
        return hasha(JSON.stringify(block));
    }

    __signature(block) {
        const privateKey = fs.readFileSync(config.rsaPrivateKey_path);
        const publicKey = fs.readFileSync(config.rsaPublicKey_path);

        const ecdsa = jwa('RS256');

        const signature = ecdsa.sign(block.blockhash, privateKey);

        return signature;
    }

    async getBlocks(page, size) {
        const blocks = await BlocksModel.getBlocks(page, size);
        return blocks;
    }

}

const block = new Block();

export default block;