import config from './config';
import network from './modules/network';
import digital from './modules/digital';
import consensus from './modules/consensus';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const app = {

    start: function() {
        
        this.dbConnect(async () => {
            await network.start();
            await digital.start();
            await consensus.start();

            // 对外提供的api
            this.api = {
                setRecordData: () => {},
                setSenate: () => {},
                setArchon: () => {}
            }

        })
        
    },

    dbConnect: function(start_process) {
        const dbURL = `mongodb://${config.db_host}/${config.db_name}`;
        mongoose.connect(dbURL, {
            user: config.db_user,
            pass: config.db_passwd,
            auth: { authdb: 'admin' },
            keepAlive: true
        }).then(
            () => { 
                console.log("0. 数据库已连接"); 
                start_process()
            },
            (err) => { console.log("0. 数据库连接失败"+err); }
        );
    }

}

export default app;
