import RecordsModel from '../../models/recordsModel';

class Record {
    constructor() {
        this.list = []; // {hash: 'hash', record: 'record'}
        console.log("digital record constructor")
    }

    produce() {
        return {
            version: this.__version(),
            timestamp: this.__timestamp(),
            recipientId: this.__recipientId(),
            senderId: this.__senderId(),
            senderPublicKey: this.__senderPublicKey(),
            hash: this.__hash(),
            message: this.__message(),
            signature: this.__signature()
        }
    }

    addRecord2List(item) {
        // const item = {hash: 'hash', record: 'record'}
        this.list.push(item)
    }

    getListValue() {
        const records = this.list.map((item) => {
            return item.record;
        })
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
        return 'test';
    }

    __timestamp() {
        return Date.now();
    }

    __recipientId() {
        return 'test';
    }

    __senderId() {
        return 'test';
    }

    __senderPublicKey() {
        return 'test';
    }

    __hash() {
        return 'test';
    }

    __message() {
        return 'test';
    }

    __signature() {
        return 'test';
    }

    
}
export default new Record();