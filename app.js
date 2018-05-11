import config from './config';
import network from './modules/network';
import digital from './modules/digital';

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const app = {

    start: function() {
        this.dbConnect(function() {
            network.start(function() {
                digital.start()
            })
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
