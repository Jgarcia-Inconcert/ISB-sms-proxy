const express = require('express');
const smsRouter = require('./sms.router');

function routerApi(app){
    const router = express.Router();
    app.use('/api/v1', router);

    router.use('/sms', smsRouter);
}

module.exports = routerApi;