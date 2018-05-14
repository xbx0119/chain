import mongoose from 'mongoose';
var Schema = mongoose.Schema;



// 节点
var peersSchema = new Schema({
    peerid: String,
    multiaddr: String,
    type: String  // 节点角色: archon执政官节点  senate元老节点   citizen公民节点
});


// 区块
var blocksSchema = new Schema({
    height: Number,
    version: String,
    timestamp: String,
    blockhash: String,
    parenthash: String,
    merkle: String,
    records: [{ 
        version: String,
        timestamp: String,
        recipientId: String,
        senderId: String,
        senderPublicKey: String,
        hash: String,
        message: String,
        signature: String
    }]
});


// 记录（交易）
var recordsSchema = new Schema({
    hash: String,
    record: String
});

export default {
    peersSchema,
    blocksSchema,
    recordsSchema
}