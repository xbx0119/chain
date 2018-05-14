import mongoose from 'mongoose';
import Schemas from './schemas';

const Records = mongoose.model('records', Schemas.recordsSchema);

const RecordsModel = {};

RecordsModel.addRecord = async function (data) {
    console.log(data)
    const res = await Records.create(data);
    if (res) {
        console.log("add: %s", res)
        return true;
    } else {
        return false;
    }
}

RecordsModel.isExisted = async function (hash) {
    const record = await Records.findOne({
        hash: hash
    });

    if(record) {
        return true;
    }else {
        return false;
    }
}


export default RecordsModel;