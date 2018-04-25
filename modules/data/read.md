

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