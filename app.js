import config from './config';
import network from './modules/network';
import digital from './modules/digital';
import consensus from './modules/consensus';
import gui from './gui';

import colors from 'colors';


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

            
            console.log(colors.green.bold("peer is running as [ %s ]"), global.peerType)
            this.startGUI()

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
                console.log(colors.green("0. 数据库已连接"))
                start_process()
            },
            (err) => { console.log("0. 数据库连接失败"+err); }
        );
    },

    startGUI: function () {
        gui.listen(config.ui_port, () => {
            console.log(colors.green.bold("gui is running on port %s"), config.ui_port)
        });
    }

}

export default app;
