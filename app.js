import config from './config';
import network from './modules/network';
import digital from './modules/digital';
import consensus from './modules/consensus';

import colors from 'colors';

// gui
import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';


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
        var gui = new Koa();
        gui.use(cors());
        gui.use(bodyParser());

        var router = new Router();
        router.get('/', (ctx, next) => {
            ctx.body = 'this is api';
        });
        router.post('/api/createRecord', async (ctx, next) => {
            const message = ctx.request.body.message;
            console.log(message)
            if(!message) {
                ctx.body = false;
            }

            const record = await digital.interface.api.createRecord(message);
            ctx.body = record;
        });
        router.get('/api/getBlocks', async (ctx, next) => {
            const 
                page = ctx.request.query.page,
                size = ctx.request.query.size;

            const blocks = await digital.interface.api.getBlocks(page, size);
            ctx.body = blocks;
        });

        gui
            .use(router.routes())
            .use(router.allowedMethods());

        gui.listen(config.ui_port, () => { 
            console.log(colors.green.bold("gui is running on port %s"), config.ui_port)
        });
    }

}

export default app;
