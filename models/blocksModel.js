import mongoose from 'mongoose';
import Schemas from './schemas';

const Blocks = mongoose.model('blocks', Schemas.blocksSchema);

const BlocksModel = {};

BlocksModel.addBlock = async function (data) {
    console.log(data)
    const block = await Blocks.findOne({ height: +data.height });
    if (!block) {
        // 添加
        const res = await Blocks.create(data);
        if(res) {
            console.log("add: %s", res)
            return true;
        }else {
            return false;
        }
    } else {
        return false;
        console.log("height exist")
    }
}

BlocksModel.removeBlock = async function (height) {
    const res = await Blocks.deleteOne({ height: height });
    if (res) return true;
    else return false;
}


BlocksModel.getAllBlocks = async function () {
    const blocks = await Blocks.find({});
    return blocks;
}


BlocksModel.maxHeight = async function () {
    const lastBlock = await this.findLastBlock();

    const height = lastBlock.height;
    return height;
}

BlocksModel.findLastBlock = async function() {
    const last = await Blocks.aggregate([
        { $sort: { "height": -1 } },
        { $limit: 1 }
    ]);
    return last[0];
}

export default BlocksModel;