import mongoose from 'mongoose';
var Schema = mongoose.Schema;



// 节点
var peersSchema = new Schema({
    peerid: String,
    multiaddr: String
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
    
});

export default {
    peersSchema,
    blocksSchema,
    recordsSchema
}