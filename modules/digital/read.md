
规范：存储统一按字符串存储，使用时仔转换为json对象



``` js
{
    "height": 0,

    // -------- 头部结构-------------
    "version": 0,
    "timestamp": 0,
    "blockhash": "", // 头哈希
    "parenthash": "", // 父哈希
    "merkle": "", // 交易hash

    // --------区块主体，包含所有交易信息，即账本---------
    "records": [

    ]
    
}


1. 版本信息
2. 随机数（挖矿过程中需要去猜测的数值）
3. 前一个区块的hash
4. 时间戳
5. Merkle树（对所有交易数据hash进行运算得到的root）
6. 交易数据列表（交易的hash）

```





``` js
// 账本中的交易记录 record
{
    "version": 0,
    "timestamp": "",
    "recipientId": "",
    "senderId": "",
    "senderPublicKey": "",
    "hash": "", // 对message的hash
    "message": "i send b a seed", // 如需加密，使用对方的公钥进行信息加密（使用自己公钥加密）

    "signature": "", // 数字签名，验证是sendid对应公钥的本人。对本次记录的hash进行私钥加密，附加到交易信息中一起发向区块链网络
}

```


demo
``` json
{
    "version": 0,
    "totalAmount": 10000000000000000,
    "totalFee": 0,
    "reward": 0,
    "payloadHash": "1cedb278bd64b910c2d4b91339bc3747960b9e0acf4a7cda8ec217c558f429ad",
    "timestamp": 0,
    "numberOfTransactions": 103,
    "payloadLength": 20326,
    "previousBlock": null,
    "generatorPublicKey": "b7b46c08c24d0f91df5387f84b068ec67b8bfff8f7f4762631894fce4aff6c75",
    "transactions": [
        {
            "type": 0,
            "amount": 10000000000000000,
            "fee": 0,
            "timestamp": 0,
            "recipientId": "6722322622037743544L",
            "senderId": "5231662701023218905L",
            "senderPublicKey": "b7b46c08c24d0f91df5387f84b068ec67b8bfff8f7f4762631894fce4aff6c75",
            "signature": "aa413208c32d00b89895049ff21797048fa41c1b2ffc866900ffd97570f8d87e852c87074ed77c6b914f47449ba3f9d6dca99874d9f235ee4c1c83d1d81b6e07",
            "id": "5534571359943011068"
        }
    ],
    "height": 1,
    "blockSignature": "2985d896becdb91c283cc2366c4a387a257b7d4751f995a81eae3aa705bc24fdb950c3afbed833e7d37a0a18074da461d68d74a3a223bc5f8e9c1fed2f3fec0e",
    "id": "8593810399212843182"
}
```