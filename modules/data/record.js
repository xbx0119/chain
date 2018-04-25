class Record {
    constructor() {
        this.data = this.produce();
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

    __version() {
        return 'test';
    }

    __timestamp() {
        return 'test';
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
module.exports = Record;