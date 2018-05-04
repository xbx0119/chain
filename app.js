const config = require('./config');
const digital = require('./modules/digital');
const network = require('./modules/network');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;




const app = {


    start: function() {
        this.dbConnect(function() {
            digital.start();
            network.start();
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
            (err) => { console.log("0. 数据库连接失败"); }
        );
    }

}

module.exports = app;
