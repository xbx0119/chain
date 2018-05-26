# chain

### introduction
Nodejs v8.10+
MongoDB


### install & run

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

### structure
* modules
    * digital 数据层
    * network 网络层
    * consensus 共识层
    * excitation 激励层
        * 发行机制
        * 分配机制
    * contract 合约层
        * 脚本代码
        * 算法机制
        * 智能合约


### docker
每个容器只做一件事情