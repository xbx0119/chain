import hasha from 'hasha';
import fs from 'fs';
import jwa from 'jwa';

import config from '../../config';

import RecordsModel from '../../models/recordsModel';

class Record {
    constructor() {
        this.list = []; // {hash: 'hash', record: 'record'}
        console.log("digital record constructor")
    }

    produce(message) {
        const record = {
            version: this.__version(),
            timestamp: this.__timestamp(),
            senderId: this.__senderId(),
            publicKey: this.__publicKey(),
            message: this.__message(message),
        }
        record.hash = this.__hash(record);
        record.signature = this.__signature(record);
        return record;
    }

    addRecord2List(item) {
        // const item = {hash: 'hash', record: 'record'}
        this.list.push(item)
    }

    getListValue() {
        const records = this.list.map((item) => {
            return item.record;
        })
        this.cleanList()
        return records;
    }

    removeConfirmedRecordFromList(confirmedRecords) {
        confirmedRecords.forEach(confirmed => {
            const index = this.list.findIndex((elem) => {
                return elem.hash = confirmed.hash;
            });
            if(index) {
                this.list.splice(index, 1)
            }
        });
    }

    cleanList() {
        this.list = [];
    }

    checkSignatureThenHash(record) {
        record = (typeof record === 'object') ? record : JSON.parse(record);
        const ecdsa = jwa('RS256');
        // 验证签名
        const flag = ecdsa.verify(record.hash, record.signature, record.publicKey);
        if(flag) {
            // 验证签名通过,验证hash合法性
            const tmp = Object.assign({}, record);
            delete tmp.signature; delete tmp.hash;
            const hash = hasha(JSON.stringify(tmp));
            if (hash === record.hash) {
                return true;
            } else {
                return false;
            }
        }else {
            return false;
        }
    }

    // 检测数据库是否存在记录，标识已经处理过
    async isExistedInDB(hash) {
        return await RecordsModel.isExisted(hash);
    }

    async storeInDB(record) {
        const document = {
            hash: record.hash,
            record: JSON.stringify(record)
        }
        const res = await RecordsModel.addRecord(document);
        if (res) { return true; }
        else { return false; }
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

    __publicKey() {
        const publicKey = fs.readFileSync(config.rsaPublicKey_path).toString();
        return publicKey;
    }
    
    __message(message) {
        message = (typeof message === 'string') ? message : JSON.stringify(message);
        return message;
    }

    __hash(record) {
        return hasha(JSON.stringify(record));
    }

    __signature(record) {
        const 
            privateKey = fs.readFileSync(config.rsaPrivateKey_path),
            publicKey = fs.readFileSync(config.rsaPublicKey_path),
            ecdsa = jwa('RS256');

        const signature = ecdsa.sign(record.hash, privateKey);
        return signature;
    }

}

const record = new Record();

export default record;