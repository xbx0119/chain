// gui
import Koa from 'koa';
import Router from 'koa-router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import KoaStatic from 'koa-static';

import views from 'koa-views';
import json from 'koa-json';
import onerror from 'koa-onerror';

import digital from './modules/digital';


var gui = new Koa();

// error handler
onerror(gui)

// middlewares
gui.use(cors());
gui.use(bodyParser({
    enableTypes: ['json', 'form', 'text']
}))
gui.use(json())
gui.use(KoaStatic(__dirname + '/gui/build'))

gui.use(views(__dirname + '/gui/build', {
    map: {
        html: 'ejs'
    }
}))

// routes
var router = new Router();
router.get('/', (ctx, next) => {
    ctx.body = 'this is api';
});
router.post('/api/createRecord', async (ctx, next) => {
    const message = ctx.request.body.message;
    console.log(message)
    if (!message) {
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
router.get('/api/getPeers', async (ctx, next) => {
    const
        page = ctx.request.query.page,
        size = ctx.request.query.size;

    const peers = await digital.interface.api.getPeers(page, size);
    ctx.body = peers;
});



gui.use(router.routes(), router.allowedMethods())


// error-handling
gui.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});



export default gui;