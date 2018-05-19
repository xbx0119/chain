


``` bash

git clone git@github.com:shellChain/chain.git
cd chain
git submodule init

# 更新子模块为远程项目的最新版本
git submodule update

# 更新子模块为远程项目的最新版本
git submodule update --remote

# 以后每次更新子模块
# 拉取服务器代码，并且合并到本地分支
git submodule update --remote --merge

```


* modules
    * data 数据层
        * 数据区块
        * 链式结构
        * 时间戳
        * 哈希函数
        * Merkle树
        * 非对称加密
    * network 网络层
        * p2p网络
        * 传播机制
        * 验证机制
    * consensus 共识层
        * POW
        * POS
        * DPOS
    * excitation 激励层
        * 发行机制
        * 分配机制
    * contract 合约层
        * 脚本代码
        * 算法机制
        * 智能合约