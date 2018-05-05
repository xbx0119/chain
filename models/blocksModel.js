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
    // const count = await Blocks.count({});
    const last = await Blocks.aggregate([
        { $sort: { "height": -1 } },
        { $limit: 1 }
    ]);
    const height = last[0].height;
    return height;
}

export default BlocksModel;