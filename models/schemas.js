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
    senderId: String,
    parenthash: String,
    records: [{ 
        version: String,
        timestamp: String,
        senderId: String,
        publicKey: String,
        message: String,
        hash: String,
        signature: String
    }],
    publicKey: String,
    merkle: String,
    blockhash: String,
    signature: String
});


// 记录（交易）
var recordsSchema = new Schema({
    hash: String,
    record: String,
});

export default {
    peersSchema,
    blocksSchema,
    recordsSchema
}