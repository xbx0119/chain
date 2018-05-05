#!/bin/sh

# 设置当前工作目录为bin
cd "$(dirname "$0")"

file_userConfig="../config/config.user.js"
file_genesisBlock="../genesisBlock.json"

genesisBlock=`cat $file_genesisBlock`

# 创建初始化用户配置
if [ ! -f "$file_userConfig" ]; then
    echo 'const config = {\n\n}; \n\nexport default config;' > $file_userConfig

    echo "创建config.user.js"
fi

# 数据库插入创世区块
blocks=`mongo chain -u root -p 806119 --authenticationDatabase "admin" --eval "db.blocks.find({})" --quiet`
if [ "$blocks" = "" ]; then
    mongo chain -u root -p 806119 --authenticationDatabase "admin" --eval "db.blocks.insert($genesisBlock)" --quiet
    echo "创世区块创建成功"
fi


echo "安装完成！"


exit 0;