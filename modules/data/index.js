// import data modules


const data = {
    start: () => {

        console.log("1. 数据层已启动");
    },

    interface: {
        // 对上层 网络层 提供的接口
        upper: {
            input: function() {
                console.log("上层向数据层输入数据")
            }
        }
    }
}

module.exports = data;