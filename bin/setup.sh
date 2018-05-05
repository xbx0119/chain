#!/bin/sh

# 设置当前工作目录为bin
cd "$(dirname "$0")"

userConfig="../config/config.user.js"



# 创建初始化用户配置
if [ ! -f "$userConfig" ]; then
    echo 'const config = {\n\n}; \n\nexport default config;' > $userConfig

    echo "创建config.user.js"
fi


echo "安装完成！"


exit 0;